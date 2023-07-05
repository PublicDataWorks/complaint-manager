import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";

const getRuleChapters = asyncMiddleware(async (request, response, next) => {
  response.status(200).send(await models.ruleChapter.findAll());
});

export default getRuleChapters;
