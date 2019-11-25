import {
  AUDIT_ACTION,
  AUDIT_TYPE
} from "../../../../../sharedUtilities/constants";
import models from "../../../../complaintManager/models";

const auditUpload = async (
  user,
  caseId,
  subject,
  auditDetails,
  transaction
) => {
  await models.action_audit.create(
    {
      user,
      caseId,
      subject,
      action: AUDIT_ACTION.UPLOADED,
      auditDetails: auditDetails,
      auditType: AUDIT_TYPE.UPLOAD
    },
    { transaction }
  );
};

export default auditUpload;
