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
    case AUDIT_ACTION.DATA_ACCESSED:
    case AUDIT_ACTION.DOWNLOADED:
      return AUDIT_TYPE.DATA_ACCESS;
    case AUDIT_ACTION.UPLOADED:
      return AUDIT_TYPE.UPLOAD;
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

const generateSnapshotForDataAccessAudit = audit => {
  const dataAccessValues = audit.dataAccessAudit.dataAccessValues;
  const sortedDataAccessValues = dataAccessValues.sort((a, b) => {
    return a.association
      .toLowerCase()
      .localeCompare(b.association.toLowerCase());
  });

  return sortedDataAccessValues
    .map(dataAccessValue => {
      const fieldString = dataAccessValue.fields
        .map(field => _.startCase(field))
        .join(", ");

      return `${
        dataAccessValue.association === "referralLetterIaproCorrections"
          ? "Referral Letter IAPro Corrections"
          : _.startCase(dataAccessValue.association)
      }: ${fieldString}`;
    })
    .join("\n\n");
};

const generateSnapshotForFileAudit = audit => {
  return `File Name: ${audit.fileAudit.fileName}`;
};

const getAttributesForAuditAction = audit => {
  switch (audit.auditAction) {
    case AUDIT_ACTION.EXPORTED:
      return {
        subject: JOB_OPERATION[audit.exportAudit.exportType].auditSubject,
        snapshot: generateSnapshotForExportAudit(audit)
      };
    case AUDIT_ACTION.DATA_ACCESSED:
      return {
        subject: audit.dataAccessAudit.auditSubject,
        snapshot: generateSnapshotForDataAccessAudit(audit)
      };
    case AUDIT_ACTION.DOWNLOADED:
    case AUDIT_ACTION.UPLOADED:
      return {
        subject: audit.fileAudit.fileType,
        snapshot: generateSnapshotForFileAudit(audit)
      };
    default:
      return {};
  }
};

const transformAuditsForExport = audits => {
  return audits.map(audit => {
    const generalAuditAttributes = {
      audit_type: getAuditTypeFromAuditAction(audit.auditAction),
      action: audit.auditAction,
      case_id: audit.caseId,
      created_at: audit.createdAt,
      user: audit.user
    };
    let attributesForAuditAction = getAttributesForAuditAction(audit);

    return {
      ...generalAuditAttributes,
      ...attributesForAuditAction
    };
  });
};

export default transformAuditsForExport;
