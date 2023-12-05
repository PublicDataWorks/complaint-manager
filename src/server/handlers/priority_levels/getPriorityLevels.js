import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";

const getPriorityLevels = asyncMiddleware(async (request, response, next) => {
  const priorityLevels = await getPriorityLevelValues();
  const priorityLevelValues = priorityLevels.map(priorityLevel => {
    return [priorityLevel.name, priorityLevel.id];
  });
  response.status(200).send(priorityLevelValues);
});

const getPriorityLevelValues = async () => {
  return await models.priority_levels.findAll({
    attributes: ["name", "id"],
    raw: true
  });
};

export default getPriorityLevels;
