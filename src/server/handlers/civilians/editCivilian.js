import {
  ADDRESSABLE_TYPE,
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../sharedUtilities/constants";
import { getCaseWithAllAssociations } from "../getCaseHelpers";
import legacyAuditDataAccess from "../legacyAuditDataAccess";
import checkFeatureToggleEnabled from "../../checkFeatureToggleEnabled";
import auditDataAccess from "../auditDataAccess";

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

const editCivilian = asyncMiddleware(async (request, response, next) => {
  const { address, ...civilianValues } = request.body;

  const newAuditFeatureToggle = checkFeatureToggleEnabled(
    request,
    "newAuditFeature"
  );

  const updatedCaseDetails = await models.sequelize.transaction(
    async transaction => {
      if (address) {
        await upsertAddress(
          request.params.civilianId,
          address,
          transaction,
          request.nickname
        );
      }
      const civilian = await models.civilian.findByPk(
        request.params.civilianId
      );
      await civilian.update(civilianValues, {
        transaction,
        auditUser: request.nickname
      });

      let auditDetails = {};

      const caseDetails = await getCaseWithAllAssociations(
        civilian.caseId,
        transaction,
        auditDetails
      );

      if (newAuditFeatureToggle) {
        await auditDataAccess(
          request.nickname,
          civilian.caseId,
          AUDIT_SUBJECT.CASE_DETAILS,
          auditDetails,
          transaction
        );
      } else {
        await legacyAuditDataAccess(
          request.nickname,
          civilian.caseId,
          AUDIT_SUBJECT.CASE_DETAILS,
          transaction,
          AUDIT_ACTION.DATA_ACCESSED,
          auditDetails
        );
      }

      return caseDetails;
    }
  );

  response.status(200).send(updatedCaseDetails);
});

module.exports = editCivilian;
