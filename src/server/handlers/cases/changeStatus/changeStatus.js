const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models/index");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const Boom = require("boom");
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const auditDataAccess = require("../../auditDataAccess");

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

    await auditDataAccess(
      request.nickname,
      request.params.id,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction
    );

    return await getCaseWithAllAssociations(caseToUpdate.id, transaction);
  });
  response.send(currentCase);
});

module.exports = changeStatus;
