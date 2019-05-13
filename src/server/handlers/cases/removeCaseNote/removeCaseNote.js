import { AUDIT_ACTION } from "../../../../sharedUtilities/constants";
import { getCaseWithAllAssociations } from "../../getCaseHelpers";
import legacyAuditDataAccess from "../../legacyAuditDataAccess";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");

const removeCaseNote = asyncMiddleware(async (req, res) => {
  const caseId = req.params.caseId;
  const caseNoteId = req.params.caseNoteId;

  const currentCase = await models.sequelize.transaction(async transaction => {
    await models.case_note.destroy({
      where: {
        id: caseNoteId
      },
      transaction,
      auditUser: req.nickname
    });

    let caseDetailsAuditDetails = {};
    const caseDetails = await getCaseWithAllAssociations(
      caseId,
      transaction,
      caseDetailsAuditDetails
    );
    const caseNotes = await models.case_note.findAll({
      where: { caseId },
      transaction
    });

    await legacyAuditDataAccess(
      req.nickname,
      caseId,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED,
      caseDetailsAuditDetails
    );

    await legacyAuditDataAccess(
      req.nickname,
      caseId,
      AUDIT_SUBJECT.CASE_NOTES,
      transaction
    );

    return {
      caseDetails,
      caseNotes
    };
  });
  res.status(200).send(currentCase);
});

module.exports = removeCaseNote;
