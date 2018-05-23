const models = require("../../models/index");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");

const updateCaseNarrative = async (request, response, next) => {
  try {
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
  } catch (e) {
    next(e);
  }
};

module.exports = updateCaseNarrative;
