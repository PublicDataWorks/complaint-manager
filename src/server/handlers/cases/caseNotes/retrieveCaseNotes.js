import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import auditDataAccess from "../../audits/auditDataAccess";
import { addAuthorDetailsToCaseNote } from "../helpers/addAuthorDetailsToCaseNote";

const {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} = require("../../../../sharedUtilities/constants");
const asyncMiddleWare = require("../../asyncMiddleware");
const models = require("../../../policeDataManager/models/index");

const retrieveCaseNotes = asyncMiddleWare(async (request, response) => {
  const rawCaseNotes = await models.sequelize.transaction(async transaction => {
    const caseNotesAndAuditDetails = await getAllCaseNotesAndAuditDetails(
      request.params.caseId,
      request.nickname,
      transaction
    );
    const allCaseNotes = caseNotesAndAuditDetails.caseNotes;
    const auditDetails = caseNotesAndAuditDetails.auditDetails;

    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_NOTES,
      auditDetails,
      transaction
    );

    return allCaseNotes;
  });

  const caseNotes = await addAuthorDetailsToCaseNote(rawCaseNotes);

  await models.sequelize
    .transaction(async transaction => {
      await auditDataAccess(
        request.nickname,
        null,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.ALL_AUTHOR_DATA_FOR_CASE_NOTES,
        { users: { attributes: ["name", "email"] } },
        transaction
      );
    })
    .catch(err => {
      // Transaction has been rolled back
      throw err;
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

module.exports = retrieveCaseNotes;
