import {
  ADDRESSABLE_TYPE,
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import { getCaseWithAllAssociationsAndAuditDetails } from "../getCaseHelpers";
import auditDataAccess from "../audits/auditDataAccess";
import { sendNotifsIfComplainantChange } from "../sendNotifsIfComplainantChange";
import { updateCaseToActiveIfInitial } from "../cases/helpers/caseStatusHelpers";

const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../policeDataManager/models/index");

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
      if (civilianValues.isUnknown) {
        models.sequelize.query(
          `UPDATE civilians 
            SET first_name = '', 
              middle_initial = NULL, 
              last_name = '', 
              suffix = NULL, 
              birth_date = NULL, 
              phone_number = NULL, 
              email = NULL, 
              additional_info = NULL, 
              is_anonymous = true, 
              race_ethnicity_id = NULL, 
              gender_identity_id = NULL, 
              civilian_title_id = NULL 
            WHERE id = ${request.params.civilianId}`,
          { transaction, auditUser: request.nickname }
        );

        models.sequelize.query(
          `DELETE 
            FROM addresses 
            WHERE addressable_type = 'civilian' 
              AND addressable_id = ${request.params.civilianId}`,
          { transaction, auditUser: request.nickname }
        );
      } else {
        await civilian.update(civilianValues, {
          transaction,
          auditUser: request.nickname
        });
      }

      await updateCaseToActiveIfInitial(
        civilian.caseId,
        request.nickname,
        transaction
      );

      const caseDetailsAndAuditDetails =
        await getCaseWithAllAssociationsAndAuditDetails(
          civilian.caseId,
          transaction,
          request.permissions
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

  response.status(200).send(await updatedCaseDetails.toJSON());

  await sendNotifsIfComplainantChange(updatedCaseDetails.id);
});

module.exports = editCivilian;
