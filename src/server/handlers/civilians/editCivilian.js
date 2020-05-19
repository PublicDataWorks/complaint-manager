import {
  ADDRESSABLE_TYPE,
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import { getCaseWithAllAssociationsAndAuditDetails } from "../getCaseHelpers";
import auditDataAccess from "../audits/auditDataAccess";
import { sendNotifsIfComplainantChange } from "../sendNotifsIfComplainantChange";

const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../complaintManager/models/index");

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

      const caseDetailsAndAuditDetails = await getCaseWithAllAssociationsAndAuditDetails(
        civilian.caseId,
        transaction
      );
      const caseDetails = caseDetailsAndAuditDetails.caseDetails;
      const auditDetails = caseDetailsAndAuditDetails.auditDetails;

      await auditDataAccess(
        request.nickname,
        civilian.caseId,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails,
        transaction
      );

      return caseDetails;
    }
  );

  await sendNotifsIfComplainantChange(updatedCaseDetails.id);
  response.status(200).send(updatedCaseDetails);
});

module.exports = editCivilian;
