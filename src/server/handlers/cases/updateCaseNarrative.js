const models = require("../../models/index");
const asyncMiddleware = require("../asyncMiddleware");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");

const updateCaseNarrative = asyncMiddleware(async (request, response) => {
  const caseId = request.params.id;

  await models.cases.update(
    {
      narrativeDetails: request.body.narrativeDetails,
      narrativeSummary: request.body.narrativeSummary
    },
    {
      where: { id: caseId },
      individualHooks: true,
      auditUser: request.nickname
    }
  );

  const updatedCase = await getCaseWithAllAssociations(caseId);

  response.send(updatedCase);
});

module.exports = updateCaseNarrative;
