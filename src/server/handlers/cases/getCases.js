const models = require("../../models/index");
const asyncMiddleware = require("../asyncMiddleware");
const { AUDIT_SUBJECT } = require("../../../sharedUtilities/constants");
const auditDataAccess = require("../auditDataAccess");

const getCases = asyncMiddleware(async (req, res) => {
  const cases = await models.sequelize.transaction(async transaction => {
    await auditDataAccess(
      req.nickname,
      undefined,
      AUDIT_SUBJECT.ALL_CASES,
      transaction
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
        ],
        order: [
          [
            { model: models.civilian, as: "complainantCivilians" },
            "createdAt",
            "ASC"
          ],
          [
            { model: models.case_officer, as: "complainantOfficers" },
            "createdAt",
            "ASC"
          ],
          [
            { model: models.case_officer, as: "accusedOfficers" },
            "createdAt",
            "ASC"
          ]
        ]
      },
      { transaction }
    );
  });

  res.status(200).send({ cases });
});

module.exports = getCases;
