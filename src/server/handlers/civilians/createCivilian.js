const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");

const createCivilian = asyncMiddleware(async (req, res) => {
  const caseId = await models.sequelize.transaction(async t => {
    const civilianCreated = await models.civilian.create(req.body, {
      include: [{ model: models.address }],
      transaction: t,
      auditUser: req.nickname
    });

    await models.cases.update(
      {
        status: "Active"
      },
      {
        where: { id: civilianCreated.caseId },
        transaction: t,
        auditUser: req.nickname
      }
    );

    return civilianCreated.caseId;
  });

  const caseDetails = await getCaseWithAllAssociations(caseId);
  res.status(201).send(caseDetails);
});

module.exports = createCivilian;
