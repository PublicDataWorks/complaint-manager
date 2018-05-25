const models = require("../../../models");
const asyncMiddleware = require("../../asyncMiddleware");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");

const editCaseOfficer = asyncMiddleware(async (request, response, next) => {
  await models.case_officer.update(request.body, {
    where: {
      id: request.params.caseOfficerId
    }
  });

  const updatedCase = await getCaseWithAllAssociations(request.params.caseId);
  response.status(200).send(updatedCase);
});

module.exports = editCaseOfficer;
