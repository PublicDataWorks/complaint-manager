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

      await models.cases.update(
        {
          status: "Active"
        },
        {
          where: {
            id: caseId
          },
          transaction,
          auditUser: req.nickname
        }
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
