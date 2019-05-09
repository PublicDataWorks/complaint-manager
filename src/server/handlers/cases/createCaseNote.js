const { AUDIT_SUBJECT } = require("../../../sharedUtilities/constants");
import legacyAuditDataAccess from "../legacyAuditDataAccess";
const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models");
import { getCaseWithAllAssociations } from "../getCaseHelpers";

const createCaseNote = asyncMiddleware(async (request, response) => {
  const currentCase = await models.sequelize.transaction(async transaction => {
    await models.case_note.create(
      {
        ...request.body,
        user: request.nickname,
        caseId: request.params.caseId
      },
      {
        transaction,
        auditUser: request.nickname
      }
    );

    await legacyAuditDataAccess(
      request.nickname,
      request.params.caseId,
      AUDIT_SUBJECT.CASE_NOTES,
      transaction
    );

    await legacyAuditDataAccess(
      request.nickname,
      request.params.caseId,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction
    );

    const caseNotes = await models.case_note.findAll({
      where: {
        caseId: request.params.caseId
      },
      include: [{ model: models.case_note_action, as: "caseNoteAction" }],
      transaction
    });

    const caseDetails = await getCaseWithAllAssociations(
      request.params.caseId,
      transaction
    );
    return { caseNotes, caseDetails };
  });

  response.status(201).send(currentCase);
});

module.exports = createCaseNote;
