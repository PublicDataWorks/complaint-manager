const models = require("../../../models");
const _ = require('lodash')

const editUserAction = async (req, res, next) => {
  try {
    const caseId = req.params.caseId;
    const userActionId = req.params.userActionId;
    const valuesToUpdate = _.pick(req.body, ['action', 'actionTakenAt', 'notes'])

    const recentActivity = await models.sequelize.transaction(async (transaction) => {
        await models.user_action.update(valuesToUpdate, {
            where: {
                id: userActionId
            }
        }, {transaction})

        await models.cases.update(
          {
            status: "Active"
          },
          {
            where: {
              id: caseId
            }
          },
          { transaction, returning: true }
        );

        return await models.user_action.findAll(
          { where: { caseId } },
          { transaction }
        );
      }
    );

    res.status(200).send(recentActivity);
  } catch (error) {
    next(error);
  }
};

module.exports = editUserAction;
