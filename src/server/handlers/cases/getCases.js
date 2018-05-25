const models = require("../../models/index");

const getCases = async (req, res, next) => {
  try {
    const cases = await models.cases.findAll({
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians"
        },
        {
          model: models.case_officer,
          as: "accusedOfficers",
          include: [models.officer]
        },
        {
          model: models.case_officer,
          as: "complainantOfficers",
          include: [models.officer]
        }
      ]
    });
    res.status(200).send({ cases });
  } catch (e) {
    next(e);
  }
};

module.exports = getCases;
