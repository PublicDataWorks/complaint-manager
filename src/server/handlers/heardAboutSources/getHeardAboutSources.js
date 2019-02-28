import asyncMiddleware from "../asyncMiddleware";
import models from "../../models";

const getHeardAboutSources = asyncMiddleware(
  async (request, response, next) => {
    const heardAboutSources = await getSortedHeardAboutSources();
    const heardAboutSourceValues = heardAboutSources.map(heardAboutSource => {
      return [heardAboutSource.name, heardAboutSource.id];
    });
    response.status(200).send(heardAboutSourceValues);
  }
);

const getSortedHeardAboutSources = async () => {
  return await models.heard_about_source.findAll({
    attributes: ["name", "id"],
    order: [["name", "ASC"]],
    raw: true
  });
};

export default getHeardAboutSources;
