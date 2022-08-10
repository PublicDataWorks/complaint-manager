import {
  AUDIT_ACTION,
  AUDIT_FIELDS_TO_EXCLUDE,
  AUDIT_SNAPSHOT_FIELDS_TO_EXCLUDE,
  AUDIT_TYPE,
  JOB_OPERATION
} from "../../../../sharedUtilities/constants";
import formatDate from "../../../../sharedUtilities/formatDate";
import _ from "lodash";
import striptags from "striptags";

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
    case AUDIT_ACTION.DATA_UPDATED:
    case AUDIT_ACTION.DATA_CREATED:
    case AUDIT_ACTION.DATA_RESTORED:
    case AUDIT_ACTION.DATA_ARCHIVED:
    case AUDIT_ACTION.DATA_DELETED:
      return AUDIT_TYPE.DATA_CHANGE;
    default:
      return "";
  }
};

const fieldNamesToIncludeInSnapshot = snapshot => {
  return Object.keys(snapshot).filter(fieldName => {
    const fieldValue = snapshot[fieldName];
    return (
      typeof fieldValue !== "object" &&
      !fieldName.match(AUDIT_SNAPSHOT_FIELDS_TO_EXCLUDE)
    );
  });
};

const transformValue = value => {
  if (value !== false && !value) return "";
  return striptags(value.toString());
};

const generateSnapshotForDataChangeAudit = audit => {
  const snapshot = audit.dataChangeAudit.snapshot;
  const modelDescription = audit.dataChangeAudit.modelDescription;
  const modelName = audit.dataChangeAudit.modelName;

  if (!snapshot) return "";

  let snapshotArray = fieldNamesToIncludeInSnapshot(snapshot).map(fieldName => {
    const formattedFieldName =
      fieldName === "id"
        ? `${generateFormattedModelName(modelName)} Id`
        : `${_.startCase(fieldName)}`;
    return `${formattedFieldName}: ${transformValue(snapshot[fieldName])}`;
  });

  if (modelDescription && modelDescription.length !== 0) {
    let modelDescriptionArray = modelDescription.map(identifier => {
      const keys = Object.keys(identifier);
      return `${_.startCase(keys[0])}: ${identifier[keys[0]] || "N/A"}`;
    });
    snapshotArray.unshift(...modelDescriptionArray, "\n");
  }

  return snapshotArray.join("\n");
};

const fieldNamesToIncludeInChanges = changes => {
  return Object.keys(changes).filter(
    fieldsName => !fieldsName.match(AUDIT_FIELDS_TO_EXCLUDE)
  );
};

const generateChangesForUpdatedDataChangeAudit = audit => {
  const changes = audit.dataChangeAudit.changes;
  if (!changes) return "";

  return fieldNamesToIncludeInChanges(changes)
    .map(fieldName => {
      return (
        `${_.startCase(fieldName)} changed from ` +
        `'${transformValue(changes[fieldName]["previous"])}' to ` +
        `'${transformValue(changes[fieldName]["new"])}'`
      );
    })
    .join("\n");
};

const generateFormattedModelName = modelName => {
  const subject = modelName;

  if (subject === "cases") {
    return "Case";
  } else {
    return _.startCase(subject);
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

      return `${_.startCase(dataAccessValue.association)}: ${fieldString}`;
    })
    .join("\n\n");
};

const generateSnapshotForLegacyDataAccessAudit = audit => {
  return audit.legacyDataAccessAudit.auditDetails.join(", ");
};

const generateSnapshotForFileAudit = audit => {
  return `File Name: ${audit.fileAudit.fileName}`;
};

const getAttributesForDataChangeAudits = audit => {
  const attributes = {
    subject: generateFormattedModelName(audit.dataChangeAudit.modelName),
    snapshot: generateSnapshotForDataChangeAudit(audit),
    subject_id: audit.dataChangeAudit.modelId
  };
  if (audit.auditAction === AUDIT_ACTION.DATA_UPDATED) {
    attributes.changes = generateChangesForUpdatedDataChangeAudit(audit);
  }

  return attributes;
};

const getAttributesForDataAccess = audit => {
  if (audit.legacyDataAccessAudit) {
    return {
      subject: audit.legacyDataAccessAudit.auditSubject,
      snapshot: generateSnapshotForLegacyDataAccessAudit(audit)
    };
  } else {
    return {
      subject: audit.dataAccessAudit.auditSubject,
      snapshot: generateSnapshotForDataAccessAudit(audit)
    };
  }
};

const getAttributesForAuditAction = audit => {
  switch (audit.auditAction) {
    case AUDIT_ACTION.EXPORTED:
      return {
        subject: JOB_OPERATION[audit.exportAudit.exportType].auditSubject,
        snapshot: generateSnapshotForExportAudit(audit)
      };
    case AUDIT_ACTION.DATA_ACCESSED:
      return getAttributesForDataAccess(audit);
    case AUDIT_ACTION.DOWNLOADED:
    case AUDIT_ACTION.UPLOADED:
      return {
        subject: audit.fileAudit.fileType,
        snapshot: generateSnapshotForFileAudit(audit)
      };
    case AUDIT_ACTION.DATA_UPDATED:
    case AUDIT_ACTION.DATA_CREATED:
    case AUDIT_ACTION.DATA_DELETED:
    case AUDIT_ACTION.DATA_RESTORED:
    case AUDIT_ACTION.DATA_ARCHIVED:
      return getAttributesForDataChangeAudits(audit);
    default:
      return {};
  }
};

const transformAuditsForExport = audits => {
  return audits.map(audit => {
    const generalAuditAttributes = {
      audit_type: getAuditTypeFromAuditAction(audit.auditAction),
      action: audit.auditAction,
      reference_id: audit.referenceId,
      manager_type: audit.managerType,
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
