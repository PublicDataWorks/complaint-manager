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

const generateSnapshot = ({ snapshot, modelDescription }) => {
  if (!snapshot) return "";

  let snapshotArray = Object.keys(snapshot).map(key => {
    return `${_.startCase(key)}: ${snapshot[key]}`;
  });

  if (modelDescription) {
    snapshotArray.unshift(modelDescription);
  }

  return snapshotArray.join("\n");
};

const transformDataChangeAuditForExport = audits => {
  const transformedAudits = audits.map(audit => {
    return {
      ...audit,
      audit_type: AUDIT_TYPE.DATA_CHANGE,
      changes:
        audit.action === DATA_UPDATED ? transformChanges(audit.changes) : "",
      snapshot: generateSnapshot(audit)
    };
  });
  return transformedAudits;
};

module.exports = transformDataChangeAuditForExport;
