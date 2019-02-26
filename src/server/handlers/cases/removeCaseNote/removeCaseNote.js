const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");
import { getCaseWithAllAssociations } from "../../getCaseHelpers";
import auditDataAccess from "../../auditDataAccess";

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

    const caseDetails = await getCaseWithAllAssociations(caseId, transaction);
    const caseNotes = await models.case_note.findAll({
      where: { caseId },
      transaction
    });

    await auditDataAccess(
      req.nickname,
      caseId,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction
    );

    await auditDataAccess(
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
