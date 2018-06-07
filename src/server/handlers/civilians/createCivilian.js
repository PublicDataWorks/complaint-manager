const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");

const createCivilian = asyncMiddleware(async (req, res) => {
  const caseId = await models.sequelize.transaction(async t => {
    let values = req.body;

    const civilianCreated = await models.civilian.create(values, {
      transaction: t,
      auditUser: req.nickname
    });

    if (req.body.address) {
      values.address = {
        ...req.body.address,
        addressableType: "civilian",
        addressableId: civilianCreated.id
      };

      await civilianCreated.createAddress(values.address, {
        auditUser: req.nickname,
        transaction: t
      });
    }

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
