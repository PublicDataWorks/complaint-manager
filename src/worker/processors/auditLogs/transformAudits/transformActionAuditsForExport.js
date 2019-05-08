import { AUDIT_TYPE, AUDIT_SUBJECT } from "../../../../sharedUtilities/constants";

const _ = require("lodash");

const generateSnapshot = (auditDetails, auditDetailsHeader) => {
  if (_.isArray(auditDetails)) {
    return auditDetails.join(", ");
  }

  let snapshotArray;
  if (_.isObject(auditDetails)) {
    snapshotArray = Object.keys(auditDetails).map(key => {
      return `${_.startCase(key)}: ${generateSnapshot(auditDetails[key])}`;
    });

    if (auditDetailsHeader) {
      snapshotArray.unshift([`${auditDetailsHeader}\n`]);
    }

    return snapshotArray.join("\n");
  }

  return "";
};

const transformActionAuditsForExport = audits => {
  return audits.map(audit => {
    return transformActionAudit(audit);
  });
};

const transformActionAudit = audit => {
  let subject, auditDetailsHeader;

  if (
    audit.auditType === AUDIT_TYPE.DATA_ACCESS &&
    audit.auditDetails &&
    !_.isArray(audit.auditDetails) &&
    _.isObject(audit.auditDetails)
  ) {
    subject = Object.keys(audit.auditDetails).join(", ");
    auditDetailsHeader = audit.subject;
    if (
      audit.subject === AUDIT_SUBJECT.ALL_WORKING_CASES ||
      audit.subject === AUDIT_SUBJECT.ALL_ARCHIVED_CASES
    ) {
      subject =
        "Case, Accused Officers, Complainant Officers, Complainant Civilians";
    }
  }

  return {
    ...audit,
    audit_type: audit.auditType,
    subject: subject ? subject : audit.subject,
    snapshot: generateSnapshot(audit.auditDetails, auditDetailsHeader)
  };
};

module.exports = transformActionAuditsForExport;
