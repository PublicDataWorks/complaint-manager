import asyncMiddleware from "../asyncMiddleware";
import models from "../../models";

const getRaceEthnicities = asyncMiddleware(async (request, response, next) => {
  const raceEthnicities = await getSortedRaceEthnicities();
  const raceEthnicityValues = raceEthnicities.map(raceEthnicity => {
    return [raceEthnicity.name, raceEthnicity.id];
  });
  response.status(200).send(raceEthnicityValues);
});

const getSortedRaceEthnicities = async () => {
  const raceEthnicities = await models.race_ethnicity.findAll({
    attributes: ["name", "id"],
    order: [["name", "ASC"]],
    raw: true
  });
  return raceEthnicities;
};

export default getRaceEthnicities;
