import { getCaseWithAllAssociations } from "../getCaseHelpers";

const models = require("../../models/index");
const asyncMiddleware = require("../asyncMiddleware");
const { AUDIT_SUBJECT } = require("../../../sharedUtilities/constants");
import legacyAuditDataAccess from "../legacyAuditDataAccess";

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

    await legacyAuditDataAccess(
      request.nickname,
      caseId,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction
    );

    return await getCaseWithAllAssociations(caseId);
  });
  response.send(updatedCase);
});

module.exports = updateCaseNarrative;
