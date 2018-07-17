const models = require("../models");
const {
  DATA_ACCESSED,
  AUDIT_TYPE
} = require("../../sharedUtilities/constants");

const auditDataAccess = async (user, caseId, subject, transaction) => {
  await models.action_audit.create(
    {
      user,
      caseId,
      action: DATA_ACCESSED,
      auditType: AUDIT_TYPE.DATA_ACCESS,
      subject
    },
    { transaction }
  );
};

module.exports = auditDataAccess;
