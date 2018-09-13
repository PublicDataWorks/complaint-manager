const _ = require("lodash");

const generateSnapshot = subjectDetails => {
  if (_.isArray(subjectDetails)) {
    return subjectDetails.join(", ");
  }

  if (_.isObject(subjectDetails)) {
    return Object.keys(subjectDetails)
      .map(key => {
        return `${_.startCase(key)}: ${subjectDetails[key]}`;
      })
      .join(", ");
  }
  return "";
};

const transformActionAuditForExport = audits => {
  return audits.map(audit => {
    return {
      ...audit,
      audit_type: audit.auditType,
      snapshot: generateSnapshot(audit.subjectDetails)
    };
  });
};

module.exports = transformActionAuditForExport;
