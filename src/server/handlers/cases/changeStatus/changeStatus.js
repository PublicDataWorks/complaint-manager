import {
  ACCUSED,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import { isEmpty } from "lodash";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import auditDataAccess from "../../audits/auditDataAccess";
import Case from "../../../policeDataManager/payloadObjects/Case";

const { CASE_STATUS } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../policeDataManager/models/index");
const Boom = require("boom");
const {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} = require("../../../../sharedUtilities/constants");

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

  const currentCase = await models.sequelize.transaction(async transaction => {
    let validationErrors = [];

    const caseToUpdate = await Case.getCase(request.params.caseId, {
      include: "status"
    });

    if (!canUpdateCaseToNewStatus(newStatus, request.permissions)) {
      throw Boom.badRequest(
        BAD_REQUEST_ERRORS.PERMISSIONS_MISSING_TO_UPDATE_STATUS
      );
    }

    await updateCaseIfValid(
      caseToUpdate,
      newStatus,
      validationErrors,
      request,
      transaction
    );

    if (newStatus === CASE_STATUS.LETTER_IN_PROGRESS) {
      // TODO maybe remove or rework since it's hardcoding NOIPM expectations
      await createReferralLetterAndLetterOfficers(
        caseToUpdate.model,
        request.nickname,
        transaction
      );
    }

    const caseDetailsAndAuditDetails =
      await getCaseWithAllAssociationsAndAuditDetails(
        caseToUpdate.id,
        transaction,
        request.permissions
      );
    const caseDetails = caseDetailsAndAuditDetails.caseDetails;
    const auditDetails = caseDetailsAndAuditDetails.auditDetails;

    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_DETAILS,
      auditDetails,
      transaction
    );
    if (!isEmpty(validationErrors)) {
      throw Boom.badRequest(
        BAD_REQUEST_ERRORS.VALIDATION_ERROR_HEADER,
        validationErrors
      );
    }

    return caseDetails;
  });
  response.send(await currentCase.toJSON());
});

const updateCaseIfValid = async (
  caseToUpdate,
  newStatus,
  validationErrors,
  request,
  transaction
) => {
  try {
    await caseToUpdate.setStatus(newStatus);
    await caseToUpdate.model.save({
      auditUser: request.nickname,
      transaction
    });
  } catch (e) {
    console.error(e);
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
  const referralLetterType = await models.letter_types.findOne({
    attributes: ["defaultRecipient", "defaultRecipientAddress"],
    where: { type: "REFERRAL" },
    include: ["defaultSender"]
  });

  let currentSender = await models.signers.findOne({
    where: { nickname }
  });
  if (!currentSender) {
    currentSender = referralLetterType.defaultSender;
  }

  await models.referral_letter.create(
    {
      caseId: caseToUpdate.id,
      recipient: referralLetterType.defaultRecipient,
      recipientAddress: referralLetterType.defaultRecipientAddress,
      sender: `${currentSender.name}\n${currentSender.title}\n${currentSender.phone}`
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
