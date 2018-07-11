const { AUDIT_SUBJECT } = require("../../../sharedUtilities/constants");

const generateSnapshot = audit => {
  switch (audit.subject) {
    case AUDIT_SUBJECT.OFFICER_DETAILS:
    case AUDIT_SUBJECT.OFFICER_ALLEGATIONS:
      return `Viewed Officer ${audit.subjectDetails}`;
    default:
      return "";
  }
};

const transformActionAuditForExport = audits => {
  return audits.map(audit => {
    return {
      ...audit,
      audit_type: audit.auditType,
      snapshot: generateSnapshot(audit)
    };
  });
};

module.exports = transformActionAuditForExport;
