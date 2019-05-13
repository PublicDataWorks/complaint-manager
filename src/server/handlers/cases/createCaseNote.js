import { AUDIT_ACTION } from "../../../sharedUtilities/constants";
import legacyAuditDataAccess from "../legacyAuditDataAccess";
import { getCaseWithAllAssociations } from "../getCaseHelpers";

const { AUDIT_SUBJECT } = require("../../../sharedUtilities/constants");
const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models");

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

    let caseAuditDetails = {};
    const caseDetails = await getCaseWithAllAssociations(
      request.params.caseId,
      transaction,
      caseAuditDetails
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
      transaction,
      AUDIT_ACTION.DATA_ACCESSED,
      caseAuditDetails
    );

    const caseNotes = await models.case_note.findAll({
      where: {
        caseId: request.params.caseId
      },
      include: [{ model: models.case_note_action, as: "caseNoteAction" }],
      transaction
    });

    return { caseNotes, caseDetails };
  });

  response.status(201).send(currentCase);
});

module.exports = createCaseNote;
