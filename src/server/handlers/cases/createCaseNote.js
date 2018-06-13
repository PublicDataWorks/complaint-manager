const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models");

const createCaseNote = asyncMiddleware(async (request, response) => {
  await models.case_note.create(
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

  const recentActivity = await models.case_note.findAll({
    where: {
      caseId: request.params.id
    }
  });

  response.status(201).send(recentActivity);
});

module.exports = createCaseNote;
