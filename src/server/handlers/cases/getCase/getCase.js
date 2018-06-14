const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");
const CASE_VIEWED = require("../../../../sharedUtilities/constants")
  .CASE_VIEWED;

const getCase = asyncMiddleware(async (req, res) => {
  const singleCase = await models.sequelize.transaction(async transaction => {
    await models.action_audit.create(
      {
        user: req.nickname,
        caseId: req.params.id,
        action: CASE_VIEWED
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
