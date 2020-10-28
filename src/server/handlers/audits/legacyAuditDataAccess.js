import models from "../../policeDataManager/models";
import { AUDIT_ACTION, AUDIT_TYPE } from "../../../sharedUtilities/constants";
import { legacyFormatAuditDetails } from "./legacyFormatAuditDetails";

const legacyAuditDataAccess = async (
  user,
  caseId,
  subject,
  transaction,
  action = AUDIT_ACTION.DATA_ACCESSED,
  auditDetails
) => {
  let formattedAuditDetails = {};
  if (auditDetails) {
    formattedAuditDetails = legacyFormatAuditDetails(auditDetails);
  }

  await models.action_audit.create(
    {
      user,
      caseId,
      action,
      auditType: AUDIT_TYPE.DATA_ACCESS,
      subject,
      auditDetails: formattedAuditDetails
    },
    { transaction }
  );
};

export default legacyAuditDataAccess;
