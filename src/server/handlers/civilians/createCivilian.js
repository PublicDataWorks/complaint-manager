const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");

const createCivilian = asyncMiddleware(async (req, res) => {
  const caseId = await models.sequelize.transaction(async t => {
    let values = req.body;

    if (req.body.address) {
      values.address = {
        ...req.body.address,
        addressableType: "civilian"
      };
    }

    const civilianCreated = await models.civilian.create(values, {
      transaction: t,
      auditUser: req.nickname,
      include: [{ model: models.address, auditUser: req.nickname }]
    });

    return civilianCreated.caseId;
  });

  const caseDetails = await getCaseWithAllAssociations(caseId);
  res.status(201).send(caseDetails);
});

module.exports = createCivilian;
