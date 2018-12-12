import { RECIPIENT, SENDER } from "../referralLetters/letterDefaults";
import {
  ACCUSED,
  SEQUELIZE_VALIDATION_ERROR,
  USER_PERMISSIONS,
  VALIDATION_ERROR_HEADER
} from "../../../../sharedUtilities/constants";

const { CASE_STATUS } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models/index");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const Boom = require("boom");
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const auditDataAccess = require("../../auditDataAccess");

const canUpdateCaseToNewStatus = (newStatus, permissions) => {
  return (
    ![CASE_STATUS.CLOSED, CASE_STATUS.FORWARDED_TO_AGENCY].includes(
      newStatus
    ) || permissions.includes(USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES)
  );
};

const changeStatus = asyncMiddleware(async (request, response, next) => {
  const newStatus = request.body.status;
  const currentCase = await models.sequelize.transaction(async transaction => {
    const caseToUpdate = await models.cases.findById(request.params.id);
    if (!caseToUpdate) {
      throw Boom.badRequest(`Case #${request.params.id} doesn't exist`);
    }

    if (!canUpdateCaseToNewStatus(newStatus, request.permissions)) {
      throw Boom.badRequest("Missing permissions to update case status");
    }

    try {
      await caseToUpdate.update(
        { status: newStatus },
        { auditUser: request.nickname, transaction }
      );
    } catch (e) {
      if (e.name === SEQUELIZE_VALIDATION_ERROR) {
        let error = Boom.badRequest(VALIDATION_ERROR_HEADER);

        error.output.payload.details = e.errors.map(error => {
          return error.message;
        });

        throw error;
      }
      throw e;
    }

    if (newStatus === CASE_STATUS.LETTER_IN_PROGRESS) {
      await models.referral_letter.create(
        {
          caseId: caseToUpdate.id,
          recipient: RECIPIENT,
          sender: SENDER
        },
        { auditUser: request.nickname, transaction }
      );

      const accusedOfficers = await models.case_officer.findAll({
        where: { caseId: caseToUpdate.id, roleOnCase: ACCUSED }
      });

      for (const accusedOfficer of accusedOfficers) {
        await models.letter_officer.create(
          {
            caseOfficerId: accusedOfficer.id
          },
          { auditUser: request.nickname, transaction }
        );
      }
    }

    await auditDataAccess(
      request.nickname,
      request.params.id,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction
    );

    return await getCaseWithAllAssociations(caseToUpdate.id, transaction);
  });
  response.send(currentCase);
});

module.exports = changeStatus;
