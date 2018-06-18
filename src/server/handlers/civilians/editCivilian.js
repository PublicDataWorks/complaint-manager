const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models/index");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");

async function upsertAddress(civilianId, address, transaction, nickname) {
  if (!address.id) {
    await models.address.create(
      {
        ...address,
        addressableId: civilianId,
        addressableType: "civilian"
      },
      {
        transaction,
        auditUser: nickname
      }
    );
  } else {
    await models.address.update(address, {
      where: { id: address.id },
      transaction,
      auditUser: nickname
    });
  }
}

const editCivilian = asyncMiddleware(async (req, res) => {
  const caseId = await models.sequelize.transaction(async t => {
    const { address, ...civilianValues } = req.body;

    //if there are address values to update
    if (address) {
      await upsertAddress(req.params.id, address, t, req.nickname);
    }

    const civilian = await models.civilian.findById(req.params.id);
    await civilian.update(civilianValues, {
      transaction: t,
      auditUser: req.nickname
    });

    return civilian.caseId;
  });

  const updatedCaseDetails = await getCaseWithAllAssociations(caseId);
  res.status(200).send(updatedCaseDetails);
});

module.exports = editCivilian;
