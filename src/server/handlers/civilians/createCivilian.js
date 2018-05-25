const models = require("../../models");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");

const createCivilian = async (req, res, next) => {
  try {
    const caseId = await models.sequelize.transaction(async t => {
      const civilianCreated = await models.civilian.create(req.body, {
        include: [{ model: models.address }],
        transaction: t
      });

      await models.cases.update(
        {
          status: "Active"
        },
        {
          where: { id: civilianCreated.caseId },
          transaction: t,
          auditUser: req.nickname
        }
      );

      return civilianCreated.caseId;
    });

    const caseDetails = await getCaseWithAllAssociations(caseId);
    res.status(201).send(caseDetails);
  } catch (e) {
    next(e);
    // How to manage adding a civilian to a case that doesn't exist
  }
};

module.exports = createCivilian;
