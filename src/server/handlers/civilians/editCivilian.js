import {
  ADDRESSABLE_TYPE,
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../sharedUtilities/constants";
import { getCaseWithAllAssociations } from "../getCaseHelpers";
import legacyAuditDataAccess from "../legacyAuditDataAccess";

const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models/index");

async function upsertAddress(civilianId, address, transaction, nickname) {
  if (!address.id) {
    await models.address.create(
      {
        ...address,
        addressableId: civilianId,
        addressableType: ADDRESSABLE_TYPE.CIVILIAN
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
        await upsertAddress(
          req.params.civilianId,
          address,
          transaction,
          req.nickname
        );
      }
      const civilian = await models.civilian.findByPk(req.params.civilianId);
      await civilian.update(civilianValues, {
        transaction,
        auditUser: req.nickname
      });

      let auditDetails = {};

      const caseDetails = await getCaseWithAllAssociations(
        civilian.caseId,
        transaction,
        auditDetails
      );

      await legacyAuditDataAccess(
        req.nickname,
        civilian.caseId,
        AUDIT_SUBJECT.CASE_DETAILS,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        auditDetails
      );

      return caseDetails;
    }
  );

  res.status(200).send(updatedCaseDetails);
});

module.exports = editCivilian;
