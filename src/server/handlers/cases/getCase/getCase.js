const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const auditDataAccess = require("../../auditDataAccess");

const getCase = asyncMiddleware(async (req, res) => {
  const singleCase = await models.sequelize.transaction(async transaction => {
    await auditDataAccess(
      req.nickname,
      req.params.caseId,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction
    );

    return await getCaseWithAllAssociations(req.params.caseId, transaction);
  });

  res.send(singleCase);
});

module.exports = getCase;
