import {
  AUDIT_ACTION,
  AUDIT_FIELDS_TO_EXCLUDE,
  AUDIT_SNAPSHOT_FIELDS_TO_EXCLUDE,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import _ from "lodash";
import striptags from "striptags";

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
  if (action !== AUDIT_ACTION.DATA_UPDATED) return "";
  if (!changes) return "";

  return fieldNamesValidForChangeList(changes)
    .map(fieldName => {
      return (
        `${_.startCase(fieldName)} changed from ` +
        `'${transformValue(changes[fieldName]["previous"])}' to ` +
        `'${transformValue(changes[fieldName]["new"])}'`
      );
    })
    .join("\n");
};

const transformValue = value => {
  if (value !== false && !value) return "";
  return striptags(value.toString());
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

module.exports = transformDataChangeAuditForExport;
