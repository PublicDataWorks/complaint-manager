const {AUDIT_SUBJECT, DATA_ACCESSED, AUDIT_TYPE} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");
const _ = require("lodash");

const editCaseNote = asyncMiddleware(async (req, res) => {
  const caseId = req.params.caseId;
  const caseNoteId = req.params.caseNoteId;
  const valuesToUpdate = _.pick(req.body, ["action", "actionTakenAt", "notes"]);

  const recentActivity = await models.sequelize.transaction(
    async transaction => {
      await models.case_note.update(valuesToUpdate, {
        where: {
          id: caseNoteId
        },
        transaction,
        auditUser: req.nickname
      });

      await models.action_audit.create(
        {
          auditType: AUDIT_TYPE.DATA_ACCESS,
          action: DATA_ACCESSED,
          subject: AUDIT_SUBJECT.CASE_NOTES,
          caseId,
          user: req.nickname
        },
        { transaction }
      );

      return await models.case_note.findAll({
        where: { caseId },
        transaction
      });
    }
  );

  res.status(200).send(recentActivity);
});

module.exports = editCaseNote;
