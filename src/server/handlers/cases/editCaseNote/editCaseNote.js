const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");
const _ = require("lodash");
import auditDataAccess from "../../auditDataAccess";

const editCaseNote = asyncMiddleware(async (req, res) => {
  const caseId = req.params.caseId;
  const caseNoteId = req.params.caseNoteId;
  const valuesToUpdate = _.pick(req.body, ["action", "actionTakenAt", "notes"]);

  const caseNotes = await models.sequelize.transaction(async transaction => {
    await models.case_note.update(valuesToUpdate, {
      where: {
        id: caseNoteId
      },
      transaction,
      auditUser: req.nickname
    });

    await auditDataAccess(
      req.nickname,
      caseId,
      AUDIT_SUBJECT.CASE_NOTES,
      transaction
    );

    return await models.case_note.findAll({
      where: { caseId },
      transaction
    });
  });

  res.status(200).send(caseNotes);
});

module.exports = editCaseNote;
