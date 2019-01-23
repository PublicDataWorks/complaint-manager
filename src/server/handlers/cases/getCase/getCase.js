import { getCaseWithAllAssociations } from "../../getCaseHelpers";
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

    return await getCaseWithAllAssociations(request.params.caseId, transaction);
  });

  response.send(singleCase);
});

module.exports = getCase;
