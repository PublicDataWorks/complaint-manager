import {
  AUDIT_ACTION,
  AUDIT_UPLOAD_DETAILS
} from "../../../../sharedUtilities/constants";
import striptags from "striptags";

const _ = require("lodash");
const {
  AUDIT_FIELDS_TO_EXCLUDE
} = require("../../../../sharedUtilities/constants");

const transformAuditsToCaseHistory = caseHistoryAudits => {
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
      caseHistory.push(transformUploadAuditToCaseHistory(audit, auditId));
      auditId++;
    });
  }

  return _.orderBy(caseHistory, ["timestamp"], "desc");
};

export const transformDataChangeAuditToCaseHistory = (audit, auditId) => {
  const details = transformDataChangeDetails(audit);
  const action = audit.auditAction;
  if (action === AUDIT_ACTION.DATA_UPDATED && _.isEmpty(details)) return;

  return {
    id: auditId,
    user: audit.user,
    action: transformDataChangeAction(audit),
    modelDescription: audit.dataChangeAudit.modelDescription,
    details: details,
    timestamp: audit.createdAt
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

const formatModelName = modelName => {
  if (modelName === "cases") {
    return "Case";
  } else {
    return _.startCase(modelName);
  }
};

const transformDataChangeAction = audit => {
  return `${formatModelName(audit.dataChangeAudit.modelName)} ${
    audit.auditAction
  }`;
};

const transformAuditAction = audit => {
  return `${audit.fileAudit.fileType} ${audit.auditAction}`;
};

const transformUploadDetails = audit => {
  return `Filename: ${audit.fileAudit.fileName}\n${_.startCase(
    audit.fileAudit.fileType
  )} finalized and uploaded to S3`;
};

const transformDataChangeDetails = audit => {
  const changes = audit.dataChangeAudit.changes;

  return _.reduce(
    changes,
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

export default transformAuditsToCaseHistory;
