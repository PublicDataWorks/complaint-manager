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
      const detail = `${_.startCase(key)} changed from '${transformNull(
        value.previous
      )}' to '${transformNull(value.new)}'`;
      return _.concat(result, detail);
    },
    []
  );
};

const transformNull = value => {
  return value == null ? "" : value;
};

module.exports = transformAuditToCaseHistory;
