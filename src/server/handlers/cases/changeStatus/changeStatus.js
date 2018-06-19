const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models/index");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const Boom = require('boom')

const changeStatus = asyncMiddleware(async (request, response, next) => {
  const caseToUpdate = await models.cases.findById(request.params.id);
  if (!caseToUpdate) {throw Boom.badRequest(`Case #${request.params.id} doesn't exist`)}

  await caseToUpdate.update(
    { status: request.body.status },
    { auditUser: request.nickname }
  );
  const caseWithAssociations = await getCaseWithAllAssociations(caseToUpdate.id);
  response.send(caseWithAssociations);
});

module.exports = changeStatus;
