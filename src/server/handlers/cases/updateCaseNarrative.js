const models = require("../../models/index");
const asyncMiddleware = require("../asyncMiddleware");
import { getCaseWithAllAssociations } from "../getCaseHelpers";
const { AUDIT_SUBJECT } = require("../../../sharedUtilities/constants");
const auditDataAccess = require("../auditDataAccess");

const updateCaseNarrative = asyncMiddleware(async (request, response) => {
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

    await auditDataAccess(
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
