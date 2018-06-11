const models = require("../../../models");
const asyncMiddleware = require("../../asyncMiddleware");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const {
  buildOfficerAttributesForUnknownOfficer,
  buildOfficerAttributesForNewOfficer
} = require("../buildOfficerAttributesHelpers");

const editCaseOfficer = asyncMiddleware(async (request, response) => {
  const { officerId, notes, roleOnCase } = request.body;
  const caseOfficerToUpdate = await models.case_officer.findOne({
    where: {
      id: request.params.caseOfficerId
    }
  });

  let officerAttributes = {};
  if (!officerId) {
    officerAttributes = buildOfficerAttributesForUnknownOfficer();
  } else if (officerId !== caseOfficerToUpdate.officerId) {
    officerAttributes = await buildOfficerAttributesForNewOfficer(officerId);
  }

  await caseOfficerToUpdate.update(
    {
      notes,
      roleOnCase,
      ...officerAttributes
    },
    {
      auditUser: request.nickname
    }
  );

  const updatedCase = await getCaseWithAllAssociations(request.params.caseId);
  response.status(200).send(updatedCase);
});

module.exports = editCaseOfficer;
