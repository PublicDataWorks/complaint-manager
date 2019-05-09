import {
  AUDIT_ACTION,
  AUDIT_TYPE,
  JOB_OPERATION
} from "../../../../sharedUtilities/constants";
import formatDate from "../../../../client/utilities/formatDate";
import _ from "lodash";

const getAuditTypeFromAuditAction = auditAction => {
  switch (auditAction) {
    case AUDIT_ACTION.LOGGED_IN:
    case AUDIT_ACTION.LOGGED_OUT:
      return AUDIT_TYPE.AUTHENTICATION;
    case AUDIT_ACTION.EXPORTED:
      return AUDIT_TYPE.EXPORT;
    default:
      return "";
  }
};

const generateSnapshotForExportAudit = audit => {
  let snapshot = "";

  if (audit.exportAudit.rangeType) {
    const formattedDateType = _.startCase(audit.exportAudit.rangeType);
    snapshot = snapshot.concat(`Date Type: ${formattedDateType}\n`);
  }
  if (audit.exportAudit.rangeStart && audit.exportAudit.rangeEnd) {
    const formattedStartDate = formatDate(audit.exportAudit.rangeStart);
    const formattedEndDate = formatDate(audit.exportAudit.rangeEnd);

    snapshot = snapshot.concat(
      `Export Range: ${formattedStartDate} to ${formattedEndDate}`
    );
  }
  if (_.isEmpty(snapshot)) {
    switch (audit.exportAudit.exportType) {
      case JOB_OPERATION.CASE_EXPORT.name:
        return "All Cases";
      case JOB_OPERATION.AUDIT_LOG_EXPORT.name:
        return "Full Audit Log";
    }
  }

  return snapshot;
};

const getAttributesForAuditAction = audit => {
  switch (audit.auditAction) {
    case AUDIT_ACTION.EXPORTED:
      return {
        subject: JOB_OPERATION[audit.exportAudit.exportType].auditSubject,
        snapshot: generateSnapshotForExportAudit(audit)
      };
    default:
      return {};
  }
};

const transformAuditsForExport = audits => {
  return audits.map(audit => {
    const auditAttributes = {
      audit_type: getAuditTypeFromAuditAction(audit.auditAction),
      action: audit.auditAction,
      case_id: audit.caseId,
      created_at: audit.createdAt,
      user: audit.user
    };
    let attributesForAuditAction = getAttributesForAuditAction(audit);

    return {
      ...auditAttributes,
      ...attributesForAuditAction
    };
  });
};

export default transformAuditsForExport;
