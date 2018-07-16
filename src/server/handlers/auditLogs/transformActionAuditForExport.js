const generateSnapshot = audit => {
  return "";
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
