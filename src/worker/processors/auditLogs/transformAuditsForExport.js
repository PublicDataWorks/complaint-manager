import { AUDIT_ACTION, AUDIT_TYPE } from "../../../sharedUtilities/constants";

const getAuditTypeFromAuditAction = auditAction => {
  switch (auditAction) {
    case AUDIT_ACTION.LOGGED_IN:
    case AUDIT_ACTION.LOGGED_OUT:
      return AUDIT_TYPE.AUTHENTICATION;
    default:
      return "";
  }
};

const transformAuditsForExport = audits => {
  return audits.map(audit => {
    return {
      audit_type: getAuditTypeFromAuditAction(audit.auditAction),
      action: audit.auditAction,
      case_id: audit.caseId,
      created_at: audit.createdAt,
      user: audit.user
    };
  });
};

export default transformAuditsForExport;
