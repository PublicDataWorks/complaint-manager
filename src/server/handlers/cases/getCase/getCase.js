import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import auditDataAccess from "../../audits/auditDataAccess";
import { MANAGER_TYPE } from "../../../../sharedUtilities/constants";

const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../policeDataManager/models");
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");

const getCase = asyncMiddleware(async (request, response) => {
  const singleCase = await models.sequelize.transaction(async transaction => {
    const caseDetailsAndAuditDetails =
      await getCaseWithAllAssociationsAndAuditDetails(
        request.params.caseId,
        transaction,
        request.permissions
      );
    const caseWithAssociations = caseDetailsAndAuditDetails.caseDetails;
    const auditDetails = caseDetailsAndAuditDetails.auditDetails;

    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_DETAILS,
      auditDetails,
      transaction
    );

    return caseWithAssociations;
  });

  response.send(await singleCase.toJSON());
});

module.exports = getCase;
