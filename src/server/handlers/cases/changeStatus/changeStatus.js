const { CASE_STATUS } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models/index");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const Boom = require("boom");
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const auditDataAccess = require("../../auditDataAccess");

const changeStatus = asyncMiddleware(async (request, response, next) => {
  const newStatus = request.body.status;
  const currentCase = await models.sequelize.transaction(async transaction => {
    const caseToUpdate = await models.cases.findById(request.params.id);
    if (!caseToUpdate) {
      throw Boom.badRequest(`Case #${request.params.id} doesn't exist`);
    }

    await caseToUpdate.update(
      { status: newStatus },
      { auditUser: request.nickname, transaction }
    );

    if (newStatus === CASE_STATUS.LETTER_IN_PROGRESS) {
      await models.referral_letter.create(
        { caseId: caseToUpdate.id },
        { auditUser: request.nickname, transaction }
      );
    }

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
