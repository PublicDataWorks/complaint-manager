const models = require("../../models");
const _ = require("lodash");

const asyncMiddleware = require("../asyncMiddleware");
const FIRST_ITEM_ABBREVIATION = "UTD";

const getClassifications = asyncMiddleware(async (request, response, next) => {
  const classifications = await getSortedClassifications();
  const classificationValues = classifications.map(classification => {
    return [classification.abbreviation, classification.id];
  });
  response.status(200).send(classificationValues);
});

const getSortedClassifications = async () => {
  const classifications = await models.classification.findAll({
    attributes: ["abbreviation", "id"],
    order: [["abbreviation", "asc"]],
    raw: true
  });
  const firstSortItem = _.remove(
    classifications,
    classification => classification.abbreviation === FIRST_ITEM_ABBREVIATION
  )[0];
  classifications.unshift(firstSortItem);
  return classifications;
};

module.exports = getClassifications;
