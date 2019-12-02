import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";
import auditDataAccess from "../audits/auditDataAccess";

const {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} = require("../../../sharedUtilities/constants");
const asyncMiddleWare = require("../asyncMiddleware");
const models = require("../../complaintManager/models/index");

const getCaseNotes = asyncMiddleWare(async (request, response) => {
  const caseNotes = await models.sequelize.transaction(async transaction => {
    const caseNotesAndAuditDetails = await getAllCaseNotesAndAuditDetails(
      request.params.caseId,
      request.nickname,
      transaction
    );
    const caseNotes = caseNotesAndAuditDetails.caseNotes;
    const auditDetails = caseNotesAndAuditDetails.auditDetails;

    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_NOTES,
      auditDetails,
      transaction
    );

    return caseNotes;
  });
  response.send(caseNotes);
});

const getAllCaseNotesAndAuditDetails = async (
  caseId,
  nickname,
  transaction
) => {
  const queryOptions = {
    where: {
      caseId: caseId
    },
    include: [{ model: models.case_note_action, as: "caseNoteAction" }],
    auditUser: nickname,
    transaction
  };

  const auditDetails = getQueryAuditAccessDetails(
    queryOptions,
    models.case_note.name
  );

  const caseNotes = await models.case_note.findAll(queryOptions);
  return { caseNotes: caseNotes, auditDetails: auditDetails };
};

module.exports = getCaseNotes;
