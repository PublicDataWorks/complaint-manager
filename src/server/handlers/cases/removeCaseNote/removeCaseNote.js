import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import auditDataAccess from "../../audits/auditDataAccess";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");

const removeCaseNote = asyncMiddleware(async (request, response) => {
  const caseId = request.params.caseId;
  const caseNoteId = request.params.caseNoteId;

  const currentCase = await models.sequelize.transaction(async transaction => {
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
      AUDIT_SUBJECT.CASE_DETAILS,
      caseAuditDetails,
      transaction
    );

    await auditDataAccess(
      request.nickname,
      caseId,
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
