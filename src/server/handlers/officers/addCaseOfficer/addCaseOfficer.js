const models = require("../../../models/index");
const asyncMiddleware = require("../../asyncMiddleware");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");

const addCaseOfficer = asyncMiddleware(async (request, response, next) => {
  const retrievedCase = await models.cases.findById(request.params.caseId);
  const caseOfficerAttributes = {
    notes: request.body.notes,
    roleOnCase: request.body.roleOnCase,
    officerId: request.body.officerId
  };

  const updatedCase = await models.sequelize.transaction(async t => {
    await retrievedCase.createAccusedOfficer(caseOfficerAttributes, {
      transaction: t
    });

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
