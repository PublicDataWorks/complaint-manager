const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");

const removeUserAction = asyncMiddleware(async (req, res) => {
  const caseId = req.params.caseId;
  const userActionId = req.params.userActionId;

  const currentCase = await models.sequelize.transaction(async transaction => {
    await models.user_action.destroy({
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
        auditUser: req.nickname,
        transaction
      }
    );

    const caseDetails = await getCaseWithAllAssociations(caseId, transaction);
    const recentActivity = await models.user_action.findAll({
      where: { caseId },
      transaction
    });

    return {
      caseDetails,
      recentActivity
    };
  });
  res.status(200).send(currentCase);
});

module.exports = removeUserAction;
