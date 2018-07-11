const {
  DATA_UPDATED,
  AUDIT_FIELDS_TO_EXCLUDE,
  AUDIT_SNAPSHOT_FIELDS_TO_EXCLUDE,
  AUDIT_TYPE
} = require("../../../sharedUtilities/constants");
const _ = require("lodash");

const transformDataChangeAuditForExport = audits => {
  return audits.map(audit => {
    return {
      ...audit,
      audit_type: AUDIT_TYPE.DATA_CHANGE,
      changes: transformChangeList(audit.action, audit.changes),
      snapshot: transformSnapshot(audit)
    };
  });
};

const transformChangeList = (action, changes) => {
  if (action !== DATA_UPDATED) return "";
  if (!changes) return "";

  return fieldNamesValidForChangeList(changes)
    .map(fieldName => {
      return (
        `${_.startCase(fieldName)} changed from ` +
        `'${changes[fieldName]["previous"] || ""}' to ` +
        `'${changes[fieldName]["new"]}'`
      );
    })
    .join("\n");
};

const fieldNamesValidForChangeList = changes => {
  return Object.keys(changes).filter(
    fieldsName => !fieldsName.match(AUDIT_FIELDS_TO_EXCLUDE)
  );
};

const fieldNamesValidForSnapshot = snapshot => {
  return Object.keys(snapshot).filter(fieldName => {
    const fieldValue = snapshot[fieldName];
    return (
      typeof fieldValue !== "object" &&
      !fieldName.match(AUDIT_SNAPSHOT_FIELDS_TO_EXCLUDE)
    );
  });
};

const transformSnapshot = ({ snapshot, subject, modelDescription }) => {
  if (!snapshot) return "";

  let snapshotArray = fieldNamesValidForSnapshot(snapshot).map(fieldName => {
    const formattedFieldName =
      fieldName === "id" ? `${subject} Id` : `${_.startCase(fieldName)}`;
    return `${formattedFieldName}: ${snapshot[fieldName]}`;
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

module.exports = transformDataChangeAuditForExport;
