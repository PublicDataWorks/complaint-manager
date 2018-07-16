const models = require("../../models/index");
const asyncMiddleware = require("../asyncMiddleware");
const {
  DATA_ACCESSED,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../../sharedUtilities/constants");

const getCases = asyncMiddleware(async (req, res) => {
  const cases = await models.sequelize.transaction(async transaction => {
    await models.action_audit.create(
      {
        user: req.nickname,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        subject: AUDIT_SUBJECT.ALL_CASES,
        action: DATA_ACCESSED
      },
      { transaction }
    );

    return await models.cases.findAll(
      {
        include: [
          {
            model: models.civilian,
            as: "complainantCivilians"
          },
          {
            model: models.case_officer,
            as: "accusedOfficers"
          },
          {
            model: models.case_officer,
            as: "complainantOfficers"
          }
        ]
      },
      { transaction }
    );
  });

  res.status(200).send({ cases });
});

module.exports = getCases;
