const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");
const _ = require("lodash");

const editUserAction = asyncMiddleware(async (req, res) => {
  const caseId = req.params.caseId;
  const userActionId = req.params.userActionId;
  const valuesToUpdate = _.pick(req.body, ["action", "actionTakenAt", "notes"]);

  const recentActivity = await models.sequelize.transaction(
    async transaction => {
      await models.user_action.update(valuesToUpdate, {
        where: {
          id: userActionId
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
          returning: true,
          auditUser: req.nickname
        }
      );

      return await models.user_action.findAll({
        where: { caseId },
        transaction
      });
    }
  );

  res.status(200).send(recentActivity);
});

module.exports = editUserAction;
