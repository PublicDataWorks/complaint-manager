import {
  BAD_REQUEST_ERRORS,
  INTERNAL_ERRORS
} from "../../../sharedUtilities/errorMessageConstants";
import auditDataAccess from "../audits/auditDataAccess";
import getQueryAuditAccessDetails, {
  combineAuditDetails
} from "../audits/getQueryAuditAccessDetails";
import {
  ADDRESSABLE_TYPE,
  CIVILIAN_INITIATED,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
const {
  CIVILIAN_WITHIN_PD_INITIATED
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);
import { get } from "lodash";
import Case from "../../policeDataManager/payloadObjects/Case";

const {
  AUDIT_SUBJECT,
  RANK_INITIATED
} = require("../../../sharedUtilities/constants");

const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../policeDataManager/models/index");
const Boom = require("boom");
const MAX_RETRIES = 3;
const FIRST_TRY = 1;

const createCase = asyncMiddleware(async (request, response, next) => {
  let newCase = {};
  const { complaintType } = get(request, ["body", "case"], {});
  if (
    complaintType === RANK_INITIATED ||
    complaintType === CIVILIAN_WITHIN_PD_INITIATED
  ) {
    newCase = await createCaseWithoutCivilian(request);
  } else {
    validateCivilianName(request.body.civilian);
    newCase = await createCaseWithCivilian(request);
  }

  response.status(201).send(await new Case(newCase).toJSON());
});

const validateCivilianName = civilian => {
  if (
    !civilian ||
    (!civilian.isUnknown &&
      (invalidName(civilian.firstName) || invalidName(civilian.lastName)))
  ) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CIVILIAN_NAME);
  }
};

const invalidName = input => {
  return !input || input.length === 0 || input.length > 25;
};

const createCaseWithoutCivilian = async request => {
  return await createCaseWithRetry(
    request.body.case,
    [],
    request.nickname,
    FIRST_TRY
  );
};

const createCaseWithCivilian = async request => {
  const newCaseAttributes = {
    ...request.body.case,
    complainantCivilians: [request.body.civilian]
  };
  const includeOptions = [
    {
      model: models.civilian,
      as: "complainantCivilians",
      auditUser: request.nickname
    }
  ];
  return await createCaseWithRetry(
    newCaseAttributes,
    includeOptions,
    request.nickname,
    FIRST_TRY
  );
};

const createCaseWithRetry = async (
  newCaseAttributes,
  includeOptions,
  nickname,
  retryNumber
) => {
  const caseAttributes = addMetadataToCaseAttributes(
    newCaseAttributes,
    nickname
  );
  try {
    return await attemptCreateCase(caseAttributes, includeOptions, nickname);
  } catch (error) {
    if (failedToCreateUniqueCaseReferenceNumber(error)) {
      if (retryNumber === MAX_RETRIES) {
        throw Boom.internal(INTERNAL_ERRORS.CASE_REFERENCE_GENERATION_FAILURE);
      }
      return await createCaseWithRetry(
        newCaseAttributes,
        includeOptions,
        nickname,
        retryNumber + 1
      );
    } else {
      throw error;
    }
  }
};

const failedToCreateUniqueCaseReferenceNumber = error => {
  return (
    error.name === "SequelizeUniqueConstraintError" &&
    Object.keys(error.fields).includes("case_number")
  );
};

const attemptCreateCase = async (caseAttributes, includeOptions, nickname) => {
  return await models.sequelize.transaction(async transaction => {
    let addressAuditDetails;

    const casesQueryOptions = {
      include: includeOptions,
      auditUser: nickname,
      transaction
    };
    const createdCase = await models.cases.create(
      caseAttributes,
      casesQueryOptions
    );
    const casesAuditDetails = getQueryAuditAccessDetails(
      casesQueryOptions,
      models.cases.name
    );

    const isCivilianInitiatedWithAddress =
      caseAttributes.complaintType === CIVILIAN_INITIATED &&
      caseAttributes.complainantCivilians[0].address;

    if (isCivilianInitiatedWithAddress) {
      await upsertAddress(
        caseAttributes.complainantCivilians[0].address,
        createdCase.complainantCivilians[0].id,
        transaction,
        nickname
      );

      addressAuditDetails = getQueryAuditAccessDetails(
        {
          auditUser: nickname,
          transaction
        },
        models.address.name
      );
    }

    const auditDetails =
      addressAuditDetails === undefined
        ? casesAuditDetails
        : combineAuditDetails(casesAuditDetails, addressAuditDetails);

    await auditDataAccess(
      nickname,
      createdCase.id,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_DETAILS,
      auditDetails,
      transaction
    );
    return createdCase;
  });
};

const upsertAddress = async (
  address,
  complainantCivilianId,
  transaction,
  auditUser
) => {
  await models.address.create(
    {
      ...address,
      addressableId: complainantCivilianId,
      addressableType: ADDRESSABLE_TYPE.CIVILIAN
    },
    {
      transaction,
      auditUser: auditUser
    }
  );
};

const addMetadataToCaseAttributes = (caseAttributes, nickname) => {
  const metadataAttributes = {
    createdBy: nickname,
    assignedTo: nickname
  };
  return { ...caseAttributes, ...metadataAttributes };
};

module.exports = createCase;
