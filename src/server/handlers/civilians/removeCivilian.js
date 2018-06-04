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
    await models.civilian.destroy({
      where: { id: request.params.civilianId },
      transaction: t,
      auditUser: request.nickname
    });
    await models.address.destroy({
      where: { id: civilian.dataValues.addressId },
      transaction: t
    });
    await models.cases.update(
      { status: "Active" },
      {
        where: { id: request.params.caseId },
        transaction: t,
        auditUser: request.nickname
      }
    );
  });

  const caseDetails = await getCaseWithAllAssociations(request.params.caseId);

  response.status(200).send(caseDetails);
});

module.exports = removeCivilian;
