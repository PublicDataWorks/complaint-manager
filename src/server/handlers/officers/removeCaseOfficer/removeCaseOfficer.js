const models = require("../../../models");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const asyncMiddleware = require("../../asyncMiddleware");
const Boom = require("boom");

const removeCaseOfficer = asyncMiddleware(async (request, response, next) => {
  const officerToRemove = await models.case_officer.findById(
    request.params.caseOfficerId
  );

  if (officerToRemove === null) {
    next(Boom.badRequest("Case Officer requested for removal does not exist."));
  }

  await officerToRemove.destroy({
    auditUser: request.nickname
  });
  const updatedCase = await getCaseWithAllAssociations(request.params.caseId);

  response.status(200).send(updatedCase);
});

module.exports = removeCaseOfficer;
