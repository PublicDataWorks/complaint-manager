import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
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

  let caseHistoryEntry;
  if (caseHistoryAudits.dataChangeAudits) {
    caseHistoryAudits.dataChangeAudits.forEach(audit => {
      caseHistoryEntry = transformDataChangeAuditToCaseHistory(audit, auditId);
      if (caseHistoryEntry) {
        caseHistory.push(caseHistoryEntry);
        auditId++;
      }
    });
  }

  if (caseHistoryAudits.uploadAudits) {
    caseHistoryAudits.uploadAudits.forEach(audit => {
      caseHistory.push(transformUploadAuditToCaseHistory(audit, caseId));
      auditId++;
    });
  }

  return _.orderBy(caseHistory, ["timestamp"], "desc");
};

export const transformDataChangeAuditToCaseHistory = (
  dataChangeAudit,
  auditId
) => {
  const details = transformDataChangeDetails(dataChangeAudit);
  if (
    dataChangeAudit.action === AUDIT_ACTION.DATA_UPDATED &&
    _.isEmpty(details)
  )
    return;

  return {
    id: auditId,
    user: dataChangeAudit.user,
    action: transformDataChangeAction(dataChangeAudit),
    modelDescription: dataChangeAudit.modelDescription,
    details: details,
    timestamp: dataChangeAudit.createdAt
  };
};

export const transformUploadAuditToCaseHistory = (uploadAudit, auditId) => {
  const details = transformUploadDetails(uploadAudit);
  return {
    id: auditId,
    user: uploadAudit.user,
    action: transformAuditAction(uploadAudit),
    modelDescription: "",
    details: details,
    timestamp: uploadAudit.createdAt
  };
};

const transformDataChangeAction = audit => {
  return `${audit.modelName} ${audit.action}`;
};

const transformAuditAction = audit => {
  return `${audit.subject} ${audit.action}`;
};

const transformUploadDetails = audit => {
  return AUDIT_UPLOAD_DETAILS.REFERRAL_LETTER_PDF;
};

const transformDataChangeDetails = audit => {
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

export default transformAuditToCaseHistory;
