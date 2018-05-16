const models = require("../../models/index");

const getCases = async (req, res) => {
  const cases = await models.cases.findAll({
    include: [
      { model: models.civilian },
      {
        model: models.case_officer,
        as: "accusedOfficers",
        include: [models.officer]
      },
      {
        model: models.case_officer,
        as: "complainantWitnessOfficers",
        include: [models.officer]
      }
    ]
  });

  res.status(200).send({ cases });
};

module.exports = getCases;
