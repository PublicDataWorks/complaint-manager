const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models/index");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");
const {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  DATA_ACCESSED
} = require("../../../sharedUtilities/constants");

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
  const { address, ...civilianValues } = req.body;

  const updatedCaseDetails = await models.sequelize.transaction(
    async transaction => {
      if (address) {
        await upsertAddress(req.params.id, address, transaction, req.nickname);
      }
      const civilian = await models.civilian.findById(req.params.id);
      await civilian.update(civilianValues, {
        transaction,
        auditUser: req.nickname
      });

      await models.action_audit.create(
        {
          caseId: civilian.caseId,
          action: DATA_ACCESSED,
          subject: AUDIT_SUBJECT.CASE_DETAILS,
          user: req.nickname,
          auditType: AUDIT_TYPE.DATA_ACCESS
        },
        { transaction }
      );

      return await getCaseWithAllAssociations(civilian.caseId, transaction);
    }
  );

  res.status(200).send(updatedCaseDetails);
});

module.exports = editCivilian;
