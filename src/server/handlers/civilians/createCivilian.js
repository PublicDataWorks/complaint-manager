const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");
const { AUDIT_SUBJECT } = require("../../../sharedUtilities/constants");
const auditDataAccess = require("../auditDataAccess");

const createCivilian = asyncMiddleware(async (req, res) => {
  const caseDetails = await models.sequelize.transaction(async transaction => {
    let values = req.body;

    if (req.body.address) {
      values.address = {
        ...req.body.address,
        addressableType: "civilian"
      };
    }

    const civilianCreated = await models.civilian.create(values, {
      auditUser: req.nickname,
      include: [{ model: models.address, auditUser: req.nickname }],
      transaction
    });

    const caseId = civilianCreated.caseId;

    await auditDataAccess(
      req.nickname,
      caseId,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction
    );

    return await getCaseWithAllAssociations(caseId, transaction);
  });

  res.status(201).send(caseDetails);
});

module.exports = createCivilian;
