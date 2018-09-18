const models = require("../../models");

const asyncMiddleware = require("../asyncMiddleware");

const getClassifications = asyncMiddleware(async (request, response, next) => {
  const classifications = await models.classification.findAll({
    order: [["abbreviation", "asc"]]
  });
  const classificationValues = classifications.map(classification => {
    return [
      classification.id,
      `${classification.abbreviation} - ${classification.name}`
    ];
  });
  response.status(200).send(classificationValues);
});

module.exports = getClassifications;
