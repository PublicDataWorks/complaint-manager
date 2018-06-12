const _ = require("lodash");
const fieldPatternToIgnore = "(.*Id$|^id$|addressableType)";

const transformAuditToCaseHistory = dataChangeAudits => {
  const caseHistory = [];
  dataChangeAudits.forEach(audit => {
    const details = transformDetails(audit);
    if (_.isEmpty(details)) return;

    caseHistory.push({
      id: audit.id,
      user: audit.user,
      action: transformAction(audit),
      modelDescription: audit.modelDescription,
      details: details,
      timestamp: audit.createdAt
    });
  });
  return caseHistory;
};

const transformAction = audit => {
  return `${_.startCase(audit.modelName)} ${audit.action}`;
};

const transformDetails = audit => {
  return _.reduce(
    audit.changes,
    (details, value, key) => {
      if (key.match(fieldPatternToIgnore)) return details;
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
