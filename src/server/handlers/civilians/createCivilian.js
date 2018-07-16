const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");
const {
  DATA_ACCESSED,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../../sharedUtilities/constants");

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

    await models.action_audit.create(
      {
        user: req.nickname,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        caseId,
        action: DATA_ACCESSED
      },
      { transaction }
    );

    return await getCaseWithAllAssociations(caseId, transaction);
  });

  res.status(201).send(caseDetails);
});

module.exports = createCivilian;
