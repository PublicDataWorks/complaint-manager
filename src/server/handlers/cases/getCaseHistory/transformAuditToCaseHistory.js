const _ = require("lodash");
const {
  AUDIT_FIELDS_TO_EXCLUDE
} = require("../../../../sharedUtilities/constants");

const transformAuditToCaseHistory = dataChangeAudits => {
  const caseHistory = [];
  let auditId = 0;
  dataChangeAudits.forEach(audit => {
    const details = transformDetails(audit);
    if (_.isEmpty(details)) return;

    caseHistory.push({
      id: auditId,
      user: audit.user,
      action: transformAction(audit),
      modelDescription: audit.modelDescription,
      details: details,
      timestamp: audit.createdAt
    });
    auditId++;
  });

  return _.orderBy(caseHistory, ["timestamp"], "desc");
};

const transformAction = audit => {
  return `${audit.modelName} ${audit.action}`;
};

const transformDetails = audit => {
  return _.reduce(
    audit.changes,
    (details, value, key) => {
      if (key.match(AUDIT_FIELDS_TO_EXCLUDE)) return details;
      details[_.startCase(key)] = {
        previous: transformNull(value.previous),
        new: transformNull(value.new)
      };
      return details;
    },
    {}
  );
};

const transformNull = value => {
  return value == null ? " " : value;
};

module.exports = transformAuditToCaseHistory;
