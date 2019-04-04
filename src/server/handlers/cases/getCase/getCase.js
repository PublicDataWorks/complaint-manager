import { getCaseWithAllAssociations } from "../../getCaseHelpers";
import { AUDIT_ACTION } from "../../../../sharedUtilities/constants";
import auditDataAccess from "../../auditDataAccess";

const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");

const getCase = asyncMiddleware(async (request, response) => {
  const singleCase = await models.sequelize.transaction(async transaction => {
    let auditDetails = {};

    const caseWithAssociations = await getCaseWithAllAssociations(
      request.params.caseId,
      transaction,
      auditDetails
    );

    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED,
      auditDetails
    );

    return caseWithAssociations;
  });

  response.send(singleCase);
});

module.exports = getCase;
