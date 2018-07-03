const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");

const createCaseNote = asyncMiddleware(async (request, response) => {
  await models.case_note.create(
    {
      ...request.body,
      user: request.nickname,
      caseId: request.params.id
    },
    { auditUser: request.nickname }
  );

  const recentActivity = await models.case_note.findAll({
    where: {
      caseId: request.params.id
    }
  });

  const caseDetails = await getCaseWithAllAssociations(request.params.id);
  response.status(201).send({ recentActivity, caseDetails });
});

module.exports = createCaseNote;
