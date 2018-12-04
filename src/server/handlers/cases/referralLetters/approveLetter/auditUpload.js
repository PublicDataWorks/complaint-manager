import {
  AUDIT_ACTION,
  AUDIT_TYPE
} from "../../../../../sharedUtilities/constants";
import models from "../../../../models";

const auditUpload = async (user, caseId, subject, transaction) => {
  await models.action_audit.create(
    {
      user,
      caseId,
      subject,
      action: AUDIT_ACTION.UPLOADED,
      auditType: AUDIT_TYPE.UPLOAD
    },
    { transaction }
  );
};

export default auditUpload;
