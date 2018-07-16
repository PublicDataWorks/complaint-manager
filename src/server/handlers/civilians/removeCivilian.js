const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");
const {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  DATA_ACCESSED
} = require("../../../sharedUtilities/constants");

const removeCivilian = asyncMiddleware(async (request, response) => {
  const caseDetails = await models.sequelize.transaction(async t => {
    const civilian = await models.civilian.findById(request.params.civilianId, {
      include: [
        {
          model: models.address
        }
      ],
      transaction: t
    });

    if (civilian.address) {
      await models.address.destroy({
        where: { id: civilian.dataValues.address.id },
        transaction: t,
        auditUser: request.nickname
      });
    }

    await models.civilian.destroy({
      where: { id: request.params.civilianId },
      transaction: t,
      auditUser: request.nickname
    });

    await models.action_audit.create(
      {
        user: request.nickname,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        caseId: civilian.caseId,
        action: DATA_ACCESSED
      },
      { transaction: t }
    );

    return await getCaseWithAllAssociations(request.params.caseId, t);
  });

  response.status(200).send(caseDetails);
});

module.exports = removeCivilian;
