import { RECIPIENT, SENDER } from "../referralLetters/referralLetterDefaults";
import {
  ACCUSED,
  AUDIT_ACTION,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import legacyAuditDataAccess from "../../audits/legacyAuditDataAccess";
import _ from "lodash";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import auditDataAccess from "../../audits/auditDataAccess";

const { CASE_STATUS } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models/index");
const Boom = require("boom");
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");

const canUpdateCaseToNewStatus = (newStatus, permissions) => {
  return (
    ![CASE_STATUS.CLOSED, CASE_STATUS.FORWARDED_TO_AGENCY].includes(
      newStatus
    ) || permissions.includes(USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES)
  );
};

const catchValidationErrors = e => {
  return e.errors.map(error => {
    return { validator: error.validatorKey, message: error.message };
  });
};

const changeStatus = asyncMiddleware(async (request, response, next) => {
  const newStatus = request.body.status;

  const caseValidationToggle = checkFeatureToggleEnabled(
    request,
    "caseValidationFeature"
  );

  const newAuditFeatureToggle = checkFeatureToggleEnabled(
    request,
    "newAuditFeature"
  );

  const currentCase = await models.sequelize.transaction(async transaction => {
    let validationErrors = [];

    const caseToUpdate = await models.cases.findByPk(request.params.caseId);

    if (!canUpdateCaseToNewStatus(newStatus, request.permissions)) {
      throw Boom.badRequest(
        BAD_REQUEST_ERRORS.PERMISSIONS_MISSING_TO_UPDATE_STATUS
      );
    }

    await updateCaseIfValid(
      caseToUpdate,
      newStatus,
      validationErrors,
      caseValidationToggle,
      request,
      transaction
    );

    if (newStatus === CASE_STATUS.LETTER_IN_PROGRESS) {
      await createReferralLetterAndLetterOfficers(
        caseToUpdate,
        request.nickname,
        transaction
      );
    }

    const caseDetailsAndAuditDetails = await getCaseWithAllAssociationsAndAuditDetails(
      caseToUpdate.id,
      transaction
    );
    const caseDetails = caseDetailsAndAuditDetails.caseDetails;
    const auditDetails = caseDetailsAndAuditDetails.auditDetails;

    if (newAuditFeatureToggle) {
      await auditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails,
        transaction
      );
    } else {
      await legacyAuditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.CASE_DETAILS,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        auditDetails
      );
    }
    if (!_.isEmpty(validationErrors)) {
      throw Boom.badRequest(
        BAD_REQUEST_ERRORS.VALIDATION_ERROR_HEADER,
        validationErrors
      );
    }

    return caseDetails;
  });
  response.send(currentCase);
});

const updateCaseIfValid = async (
  caseToUpdate,
  newStatus,
  validationErrors,
  caseValidationToggle,
  request,
  transaction
) => {
  try {
    await caseToUpdate.update(
      { status: newStatus },
      {
        auditUser: request.nickname,
        transaction,
        validate: caseValidationToggle
      }
    );
  } catch (e) {
    if (e.message === BAD_REQUEST_ERRORS.INVALID_CASE_STATUS) {
      throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS_FOR_UPDATE);
    }
    if (e.name === BAD_REQUEST_ERRORS.SEQUELIZE_VALIDATION_ERROR) {
      validationErrors.push(...catchValidationErrors(e));
    } else {
      throw e;
    }
  }
};

const createReferralLetterAndLetterOfficers = async (
  caseToUpdate,
  nickname,
  transaction
) => {
  await models.referral_letter.create(
    {
      caseId: caseToUpdate.id,
      recipient: RECIPIENT,
      sender: SENDER
    },
    { auditUser: nickname, transaction }
  );

  const accusedOfficers = await models.case_officer.findAll({
    where: { caseId: caseToUpdate.id, roleOnCase: ACCUSED }
  });

  for (const accusedOfficer of accusedOfficers) {
    await models.letter_officer.create(
      {
        caseOfficerId: accusedOfficer.id
      },
      { auditUser: nickname, transaction }
    );
  }
};

module.exports = changeStatus;
