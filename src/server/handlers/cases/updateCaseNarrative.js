import { getCaseWithAllAssociationsAndAuditDetails } from "../getCaseHelpers";
import auditDataAccess from "../audits/auditDataAccess";

const models = require("../../models/index");
const asyncMiddleware = require("../asyncMiddleware");
const { AUDIT_SUBJECT } = require("../../../sharedUtilities/constants");

const updateCaseNarrative = asyncMiddleware(async (request, response, next) => {
  const updatedCase = await models.sequelize.transaction(async transaction => {
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

    const caseDetailsAndAuditDetails = await getCaseWithAllAssociationsAndAuditDetails(
      caseId,
      transaction
    );
    const caseDetails = caseDetailsAndAuditDetails.caseDetails;
    const auditDetails = caseDetailsAndAuditDetails.auditDetails;

    await auditDataAccess(
      request.nickname,
      caseId,
      AUDIT_SUBJECT.CASE_DETAILS,
      auditDetails,
      transaction
    );

    return caseDetails;
  });
  response.send(updatedCase);
});

module.exports = updateCaseNarrative;
