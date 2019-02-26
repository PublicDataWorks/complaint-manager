import { AUDIT_TYPE } from "../../../sharedUtilities/constants";

const _ = require("lodash");

const generateSnapshot = (subjectDetails, subjectDetailsHeader) => {
  if (_.isArray(subjectDetails)) {
    return subjectDetails.join(", ");
  }

  let snapshotArray;
  if (_.isObject(subjectDetails)) {
    snapshotArray = Object.keys(subjectDetails).map(key => {
      return `${_.startCase(key)}: ${generateSnapshot(subjectDetails[key])}`;
    });

    if (subjectDetailsHeader) {
      snapshotArray.unshift([`${subjectDetailsHeader}\n`]);
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
  let subject, subjectDetailsHeader;
  if (
    audit.auditType === AUDIT_TYPE.DATA_ACCESS &&
    audit.subjectDetails &&
    !_.isArray(audit.subjectDetails) &&
    _.isObject(audit.subjectDetails)
  ) {
    subject = Object.keys(audit.subjectDetails).join(", ");
    subjectDetailsHeader = audit.subject;
  }

  return {
    ...audit,
    audit_type: audit.auditType,
    subject: subject ? subject : audit.subject,
    snapshot: generateSnapshot(audit.subjectDetails, subjectDetailsHeader)
  };
};

module.exports = transformActionAuditsForExport;
