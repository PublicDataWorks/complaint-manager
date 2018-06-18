const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");

const removeCivilian = asyncMiddleware(async (request, response) => {
  const civilian = await models.civilian.findById(request.params.civilianId, {
    include: [
      {
        model: models.address
      }
    ]
  });

  await models.sequelize.transaction(async t => {

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
  });

  const caseDetails = await getCaseWithAllAssociations(request.params.caseId);

  response.status(200).send(caseDetails);
});

module.exports = removeCivilian;
