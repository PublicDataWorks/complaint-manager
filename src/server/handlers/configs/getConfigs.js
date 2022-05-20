import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";

const getConfigs = asyncMiddleware(async (request, response, next) => {
  let configs = await models.config.findAll({
    attributes: ["name", "value"]
  });

  let configResponse = configs.reduce((obj, config) => {
    obj[config.name] = config.value;
    return obj;
  }, {});

  response.status(200).send(configResponse);
});

export default getConfigs;
