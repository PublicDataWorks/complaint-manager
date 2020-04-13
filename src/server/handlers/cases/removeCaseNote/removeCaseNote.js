import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import auditDataAccess from "../../audits/auditDataAccess";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { isCaseNoteAuthor } from "../helpers/isCaseNoteAuthor";

const {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../complaintManager/models");

const removeCaseNote = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;
  const caseNoteId = request.params.caseNoteId;

  const operationsPermitted = await isCaseNoteAuthor(
    request.nickname,
    caseNoteId
  );
  if (!operationsPermitted)
    throw Boom.badRequest(BAD_REQUEST_ERRORS.ACTION_NOT_ALLOWED);

  const currentCase = await models.sequelize.transaction(async transaction => {
    await models.notification
      .destroy({
        where: {
          caseNoteId: caseNoteId
        },
        transaction,
        auditUser: request.nickname
      })
      .catch(() => {
        throw Boom.badData(BAD_REQUEST_ERRORS.NOTIFICATION_DELETION_ERROR);
      });

    await models.case_note.destroy({
      where: {
        id: caseNoteId
      },
      transaction,
      auditUser: request.nickname
    });

    const caseDetailsAndAuditDetails = await getCaseWithAllAssociationsAndAuditDetails(
      caseId,
      transaction
    );
    const caseDetails = caseDetailsAndAuditDetails.caseDetails;
    const caseAuditDetails = caseDetailsAndAuditDetails.auditDetails;

    const caseNotesQueryOptions = {
      where: { caseId },
      transaction
    };
    const caseNotes = await models.case_note.findAll(caseNotesQueryOptions);
    const caseNotesAuditDetails = getQueryAuditAccessDetails(
      caseNotesQueryOptions,
      models.case_note.name
    );

    await auditDataAccess(
      request.nickname,
      caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_DETAILS,
      caseAuditDetails,
      transaction
    );

    await auditDataAccess(
      request.nickname,
      caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_NOTES,
      caseNotesAuditDetails,
      transaction
    );

    return {
      caseDetails,
      caseNotes
    };
  });
  response.status(200).send(currentCase);
});

module.exports = removeCaseNote;
