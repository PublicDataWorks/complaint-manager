const models = require("../../models/index");
const asyncMiddleware = require("../asyncMiddleware");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");
const {
  DATA_ACCESSED,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} = require("../../../sharedUtilities/constants");

const updateCaseNarrative = asyncMiddleware(async (request, response) => {
  const updatedCase = await models.sequelize.transaction(async transaction => {
    const caseId = request.params.id;

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

    await models.action_audit.create(
      {
        caseId,
        user: request.nickname,
        action: DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        subject: AUDIT_SUBJECT.CASE_DETAILS
      },
      transaction
    );

    return await getCaseWithAllAssociations(caseId);
  });
  response.send(updatedCase);
});

module.exports = updateCaseNarrative;
