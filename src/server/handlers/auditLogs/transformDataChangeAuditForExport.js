const {
  DATA_UPDATED,
  AUDIT_FIELDS_TO_EXCLUDE,
  AUDIT_TYPE
} = require("../../../sharedUtilities/constants");
const _ = require("lodash");

const transformChanges = changes => {
  if (!changes) {
    return "";
  }

  const changesToInclude = Object.keys(changes).filter(
    key => !key.match(AUDIT_FIELDS_TO_EXCLUDE)
  );

  return changesToInclude
    .map(key => {
      return `${_.startCase(key)} changed from '${changes[key]["previous"] ||
        ""}' to '${changes[key]["new"]}'`;
    })
    .join("\n");
};

const shouldShowInSnapshot = (value, key) => {
  return !(
    typeof value === "object" ||
    key === "addressableId" ||
    key === "addressableType"
  );
};

const generateSnapshot = ({ snapshot, subject, modelDescription }) => {
  if (!snapshot) return "";

  const snapshotKeysToShow = Object.keys(snapshot).filter(key =>
    shouldShowInSnapshot(snapshot[key], key)
  );

  let snapshotArray = snapshotKeysToShow.map(key => {
    const formattedKey =
      key === "id" ? `${subject} DB ID` : `${_.startCase(key)}`;
    return `${formattedKey}: ${snapshot[key]}`;
  });

  if (modelDescription) {
    snapshotArray.unshift(modelDescription);
  }

  return snapshotArray.join("\n");
};

const transformDataChangeAuditForExport = audits => {
  return audits.map(audit => {
    return {
      ...audit,
      audit_type: AUDIT_TYPE.DATA_CHANGE,
      changes:
        audit.action === DATA_UPDATED ? transformChanges(audit.changes) : "",
      snapshot: generateSnapshot(audit)
    };
  });
};

module.exports = transformDataChangeAuditForExport;
