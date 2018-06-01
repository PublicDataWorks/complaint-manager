const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models");

const createUserAction = asyncMiddleware(async (request, response) => {
  await models.user_action.create(
    {
      ...request.body,
      user: request.nickname,
      caseId: request.params.id
    },
    { auditUser: request.nickname }
  );

  await models.cases.update(
    { status: "Active" },
    {
      where: { id: request.params.id },
      auditUser: request.nickname
    }
  );

  const recentActivity = await models.user_action.findAll({
    where: {
      caseId: request.params.id
    }
  });

  response.status(201).send(recentActivity);
});

module.exports = createUserAction;
