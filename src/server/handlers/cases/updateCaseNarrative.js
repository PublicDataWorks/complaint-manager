import { getCaseWithAllAssociationsAndAuditDetails } from "../getCaseHelpers";
import auditDataAccess from "../audits/auditDataAccess";

const models = require("../../policeDataManager/models/index");
const asyncMiddleware = require("../asyncMiddleware");
const {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} = require("../../../sharedUtilities/constants");

const updateCaseNarrative = asyncMiddleware(async function handle(
  request,
  response,
  next
) {
  const updatedCase = await models.sequelize.transaction(
    async function executeTransaction(transaction) {
      const caseId = request.params.caseId;

      await models.cases.update(
        {
          narrativeDetails: request.body.narrativeDetails,
          narrativeSummary: request.body.narrativeSummary
        },
        {
          where: { id: caseId },
          individualHooks: true,
          auditUser: request.nickname
        },
        transaction
      );

      const caseDetailsAndAuditDetails =
        await getCaseWithAllAssociationsAndAuditDetails(
          caseId,
          transaction,
          request.permissions
        );
      const caseDetails = caseDetailsAndAuditDetails.caseDetails;
      const auditDetails = caseDetailsAndAuditDetails.auditDetails;

      await auditDataAccess(
        request.nickname,
        caseId,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails,
        transaction
      );

      return caseDetails;
    }
  );
  response.send(updatedCase);
});

module.exports = updateCaseNarrative;
