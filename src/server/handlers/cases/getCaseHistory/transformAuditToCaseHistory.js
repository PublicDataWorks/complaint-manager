import {
  AUDIT_ACTION,
  AUDIT_UPLOAD_DETAILS
} from "../../../../sharedUtilities/constants";
import striptags from "striptags";

const _ = require("lodash");
const {
  AUDIT_FIELDS_TO_EXCLUDE
} = require("../../../../sharedUtilities/constants");

const transformAuditToCaseHistory = caseHistoryAudits => {
  const caseHistory = [];
  let auditId = 0;
  caseHistoryAudits.forEach(audit => {
    const details = transformDetails(audit);
    if (audit.action === AUDIT_ACTION.DATA_UPDATED && _.isEmpty(details))
      return;

    caseHistory.push({
      id: auditId,
      user: audit.user,
      action: transformAction(audit),
      modelDescription: transformDescription(audit),
      details: details,
      timestamp: audit.createdAt
    });
    auditId++;
  });

  return _.orderBy(caseHistory, ["timestamp"], "desc");
};

const transformAction = audit => {
  if (audit.action === AUDIT_ACTION.UPLOADED) {
    return `${audit.subject} ${audit.action}`;
  }
  return `${audit.modelName} ${audit.action}`;
};

const transformDescription = audit => {
  if (audit.action === AUDIT_ACTION.UPLOADED) {
    return "";
  }
  return audit.modelDescription;
};

const transformDetails = audit => {
  if (audit.action === AUDIT_ACTION.UPLOADED) {
    return AUDIT_UPLOAD_DETAILS.REFERRAL_LETTER_PDF;
  }
  return _.reduce(
    audit.changes,
    (details, value, key) => {
      if (key.match(AUDIT_FIELDS_TO_EXCLUDE)) {
        return details;
      }
      details[_.startCase(key)] = {
        previous: transformValue(value.previous),
        new: transformValue(value.new)
      };
      return details;
    },
    {}
  );
};

const transformValue = value => {
  if (value !== false && !value) return " ";
  return striptags(value.toString());
};

module.exports = transformAuditToCaseHistory;
