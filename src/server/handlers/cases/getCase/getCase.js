const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const auditDataAccess = require("../../auditDataAccess");

const getCase = asyncMiddleware(async (request, response) => {
  const singleCase = await models.sequelize.transaction(async transaction => {
    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction
    );

    const caseWithAssociations = await getCaseWithAllAssociations(
      request.params.caseId,
      transaction
    );
    return caseWithAssociations;
  });

  response.send(singleCase);
});

module.exports = getCase;
