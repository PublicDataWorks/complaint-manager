const asyncMiddleware = require("../../asyncMiddleware");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const models = require("../../../models");
const _ = require("lodash");

const createOfficerAllegation = asyncMiddleware(async (request, response) => {
  const caseOfficer = await models.case_officer.findById(
    request.params.caseOfficerId
  );

  const allegationAttributes = _.pick(request.body, [
    "allegationId",
    "details"
  ]);

  await caseOfficer.createAllegation(allegationAttributes, {
    auditUser: request.nickname
  });

  const caseWithAssociations = await getCaseWithAllAssociations(
    request.params.caseId
  );
  return response.status(201).send(caseWithAssociations);
});

module.exports = createOfficerAllegation;
