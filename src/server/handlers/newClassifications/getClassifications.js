import shiftSingleElementOfArray from "../../../sharedUtilities/shiftSingleElementOfArray";

const models = require("../../models");
const _ = require("lodash");

const asyncMiddleware = require("../asyncMiddleware");

const DECLINES_OPTION = "Declines to classify";

const getClassifications = asyncMiddleware(async (request, response, next) => {
  const classifications = await getSortedClassifications();
  const classificationValues = classifications.map(classification => {
    return [classification.name, classification.message, classification.id];
  });
  response.status(200).send(classificationValues);
});

const getSortedClassifications = async () => {
  const allClassifications = await models.new_classifications.findAll({
    attributes: ["name", "message", "id"],
    raw: true
  });
  const declineOption = allClassifications.find(
    option => option.name === DECLINES_OPTION
  );
  const finalIndex = allClassifications.length - 1;
  shiftSingleElementOfArray(allClassifications, declineOption, finalIndex);
  return allClassifications;
};

export default getClassifications;
