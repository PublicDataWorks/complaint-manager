import asyncMiddleware from "../asyncMiddleware";
import models from "../../models";

const getHowDidYouHearAboutUsSources = asyncMiddleware(
  async (request, response, next) => {
    const howDidYouHearAboutUsSources = await getSortedHowDidYouHearAboutUsSources();
    const howDidYouHearAboutUsSourceValues = howDidYouHearAboutUsSources.map(
      howDidYouHearAboutUsSource => {
        return [howDidYouHearAboutUsSource.name, howDidYouHearAboutUsSource.id];
      }
    );
    response.status(200).send(howDidYouHearAboutUsSourceValues);
  }
);

const getSortedHowDidYouHearAboutUsSources = async () => {
  return await models.how_did_you_hear_about_us_source.findAll({
    attributes: ["name", "id"],
    order: [["name", "ASC"]],
    raw: true
  });
};

export default getHowDidYouHearAboutUsSources;
