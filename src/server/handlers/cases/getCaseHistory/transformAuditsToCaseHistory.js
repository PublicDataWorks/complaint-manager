import {
  AUDIT_ACTION,
  AUDIT_UPLOAD_DETAILS
} from "../../../../sharedUtilities/constants";
import striptags from "striptags";

const _ = require("lodash");
const {
  AUDIT_FIELDS_TO_EXCLUDE
} = require("../../../../sharedUtilities/constants");

const transformAuditsToCaseHistory = (
  caseHistoryAudits,
  newAuditFeatureToggle = true
) => {
  const caseHistory = [];
  let auditId = 0;

  let caseHistoryEntry;
  if (caseHistoryAudits.dataChangeAudits) {
    caseHistoryAudits.dataChangeAudits.forEach(audit => {
      caseHistoryEntry = transformDataChangeAuditToCaseHistory(
        audit,
        auditId,
        newAuditFeatureToggle
      );
      if (caseHistoryEntry) {
        caseHistory.push(caseHistoryEntry);
        auditId++;
      }
    });
  }

  if (caseHistoryAudits.uploadAudits) {
    caseHistoryAudits.uploadAudits.forEach(audit => {
      caseHistory.push(
        transformUploadAuditToCaseHistory(audit, auditId, newAuditFeatureToggle)
      );
      auditId++;
    });
  }

  return _.orderBy(caseHistory, ["timestamp"], "desc");
};

export const transformDataChangeAuditToCaseHistory = (
  audit,
  auditId,
  newAuditFeatureToggle = true
) => {
  const details = transformDataChangeDetails(audit, newAuditFeatureToggle);
  const action = newAuditFeatureToggle ? audit.auditAction : audit.action;
  if (action === AUDIT_ACTION.DATA_UPDATED && _.isEmpty(details)) return;

  return {
    id: auditId,
    user: audit.user,
    action: transformDataChangeAction(audit, newAuditFeatureToggle),
    modelDescription: newAuditFeatureToggle
      ? audit.dataChangeAudit.modelDescription
      : audit.modelDescription,
    details: details,
    timestamp: audit.createdAt
  };
};

export const transformUploadAuditToCaseHistory = (
  uploadAudit,
  auditId,
  newAuditFeatureToggle = true
) => {
  const details = transformUploadDetails(uploadAudit, newAuditFeatureToggle);
  return {
    id: auditId,
    user: uploadAudit.user,
    action: transformAuditAction(uploadAudit, newAuditFeatureToggle),
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

const transformDataChangeAction = (audit, newAuditFeatureToggle = true) => {
  if (newAuditFeatureToggle) {
    return `${formatModelName(audit.dataChangeAudit.modelName)} ${
      audit.auditAction
    }`;
  } else {
    return `${audit.modelName} ${audit.action}`;
  }
};

const transformAuditAction = (audit, newAuditFeatureToggle = true) => {
  if (newAuditFeatureToggle) {
    return `${audit.fileAudit.fileType} ${audit.auditAction}`;
  } else {
    return `${audit.subject} ${audit.action}`;
  }
};

const transformUploadDetails = (audit, newAuditFeatureToggle = true) => {
  if (newAuditFeatureToggle) {
    return `Filename: ${audit.fileAudit.fileName}\n${_.startCase(
      audit.fileAudit.fileType
    )} finalized and uploaded to S3`;
  } else {
    return AUDIT_UPLOAD_DETAILS.REFERRAL_LETTER_PDF;
  }
};

const transformDataChangeDetails = (audit, newAuditFeatureToggle = true) => {
  const changes = newAuditFeatureToggle
    ? audit.dataChangeAudit.changes
    : audit.changes;

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
