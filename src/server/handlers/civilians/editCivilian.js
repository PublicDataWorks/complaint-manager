const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models/index");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");

async function upsertAddress(
  civilianId,
  addressId,
  address,
  transaction,
  nickname
) {
  if (!addressId) {
    const createdAddress = await models.address.create(
      {
        ...address
      },
      {
        transaction
      }
    );

    await models.civilian.update(
      {
        addressId: createdAddress.id
      },
      {
        where: { id: civilianId },
        auditUser: nickname,
        transaction
      }
    );
  } else {
    await models.address.update(address, {
      where: { id: addressId },
      transaction
    });
  }
}

const editCivilian = asyncMiddleware(async (req, res) => {
  const caseId = await models.sequelize.transaction(async t => {
    const { addressId, address, ...civilianValues } = req.body;

    //if there are address values to update
    if (address) {
      await upsertAddress(
        civilianValues.id,
        addressId,
        address,
        t,
        req.nickname
      );
    }

    const updatedCivilian = await models.civilian.update(civilianValues, {
      where: { id: req.params.id },
      transaction: t,
      auditUser: req.nickname
    });

    const caseId = updatedCivilian[1][0].dataValues.caseId;

    await models.cases.update(
      { status: "Active" },
      {
        where: { id: caseId },
        transaction: t,
        auditUser: req.nickname
      }
    );

    return caseId;
  });

  const updatedCaseDetails = await getCaseWithAllAssociations(caseId);
  res.status(200).send(updatedCaseDetails);
});

module.exports = editCivilian;
