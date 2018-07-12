const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");
const {
  DATA_ACCESSED,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../../../sharedUtilities/constants");

const getCase = asyncMiddleware(async (req, res) => {
  const singleCase = await models.sequelize.transaction(async transaction => {
    await models.action_audit.create(
      {
        user: req.nickname,
        caseId: req.params.id,
        action: DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        subject: AUDIT_SUBJECT.CASE_DETAILS
      },
      { transaction }
    );
    const caseWithAssociations = await getCaseWithAllAssociations(
      req.params.id,
      transaction
    );
    return caseWithAssociations;
  });

  res.send(singleCase);
});

module.exports = getCase;
