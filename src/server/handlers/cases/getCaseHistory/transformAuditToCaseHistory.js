const _ = require("lodash");

const transformAuditToCaseHistory = dataChangeAudits => {
  return dataChangeAudits.map(audit => {
    return {
      id: audit.id,
      user: audit.user,
      action: transformAction(audit),
      details: transformDetails(audit),
      timestamp: audit.createdAt
    };
  });
};

const transformAction = audit => {
  return `${_.upperFirst(audit.modelName)} ${audit.action}`;
};

const transformDetails = audit => {
  return _.reduce(
    audit.changes,
    (result, value, key) => {
      result[_.startCase(key)] = {
        previous: transformNull(value.previous),
        new: transformNull(value.new)
      };
      return result;
    },
    {}
  );
};

const transformNull = value => {
  return value == null ? "" : value;
};

module.exports = transformAuditToCaseHistory;
