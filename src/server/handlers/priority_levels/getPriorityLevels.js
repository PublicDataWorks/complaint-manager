import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";
import { ASCENDING } from "../../../sharedUtilities/constants";

const getPriorityLevels = asyncMiddleware(async (request, response, next) => {
  const priorityLevels = await getSortedPriorityLevels();
  const priorityLevelValues = priorityLevels.map(priorityLevel => {
    return [priorityLevel.name, priorityLevel.id];
  });
  response.status(200).send(priorityLevelValues);
});

const getSortedPriorityLevels = async () => {
  return await models.priority_levels.findAll({
    attributes: ["name", "id"],
    order: [["name", ASCENDING]],
    raw: true
  });
};

export default getPriorityLevels;
