const models = require("../../models/index");
const asyncMiddleware = require("../asyncMiddleware");

const getCases = asyncMiddleware(async (req, res) => {
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
});

module.exports = getCases;
