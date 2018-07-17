const models = require("../models");
const {
  DATA_ACCESSED,
  AUDIT_TYPE
} = require("../../sharedUtilities/constants");

const auditDataAccess = async (
  user,
  caseId,
  subject,
  transaction,
  action = DATA_ACCESSED
) => {
  return await models.action_audit.create(
    {
      user,
      caseId,
      action,
      auditType: AUDIT_TYPE.DATA_ACCESS,
      subject
    },
    { transaction }
  );
};

module.exports = auditDataAccess;
