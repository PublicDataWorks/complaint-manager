const {
  buildOfficerAttributesForNewOfficer,
  buildOfficerAttributesForUnknownOfficer
} = require("../buildOfficerAttributesHelpers");

const models = require("../../../models/index");
const asyncMiddleware = require("../../asyncMiddleware");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");

const addCaseOfficer = asyncMiddleware(async (request, response, next) => {
  const { officerId, notes, roleOnCase } = request.body;

  const retrievedCase = await models.cases.findById(request.params.caseId);
  let caseOfficerAttributes = {};
  if (!officerId) {
    caseOfficerAttributes = buildOfficerAttributesForUnknownOfficer();
  } else {
    caseOfficerAttributes = await buildOfficerAttributesForNewOfficer(
      officerId
    );
  }

  const updatedCase = await models.sequelize.transaction(async t => {
    await retrievedCase.createAccusedOfficer(
      { notes, roleOnCase, ...caseOfficerAttributes },
      {
        transaction: t,
        auditUser: request.nickname
      }
    );

    await models.cases.update(
      { status: "Active" },
      {
        where: {
          id: request.params.caseId
        },
        auditUser: request.nickname
      }
    );

    return await getCaseWithAllAssociations(retrievedCase.id, t);
  });

  return response.send(updatedCase);
});

module.exports = addCaseOfficer;
