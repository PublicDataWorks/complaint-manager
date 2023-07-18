import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";

const getDirectives = asyncMiddleware(async (request, response, next) => {
  response.status(200).send(await models.directive.findAll());
});

export default getDirectives;
