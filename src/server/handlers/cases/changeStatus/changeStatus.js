const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models/index");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const Boom = require("boom");
const {
  DATA_ACCESSED,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../../../sharedUtilities/constants");

const changeStatus = asyncMiddleware(async (request, response, next) => {
  const currentCase = await models.sequelize.transaction(async transaction => {
    const caseToUpdate = await models.cases.findById(request.params.id);
    if (!caseToUpdate) {
      throw Boom.badRequest(`Case #${request.params.id} doesn't exist`);
    }

    await caseToUpdate.update(
      { status: request.body.status },
      { auditUser: request.nickname },
      transaction
    );

    await models.action_audit.create(
      {
        user: request.nickname,
        caseId: request.params.id,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        action: DATA_ACCESSED,
        subject: AUDIT_SUBJECT.CASE_DETAILS
      },
      transaction
    );

    return await getCaseWithAllAssociations(caseToUpdate.id, transaction);
  });
  response.send(currentCase);
});

module.exports = changeStatus;
