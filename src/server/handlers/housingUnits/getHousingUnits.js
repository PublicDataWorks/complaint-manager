import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";

const getHousingUnits = asyncMiddleware(async (request, response, next) => {
  if (!request.params.facilityId) {
    response.status(400).send("Facility ID is required");
    return;
  }
  try {
    const housingUnits = await models.housing_unit.findAll({
      where: { facilityId: request.params.facilityId }
    });

    response.status(200).send(housingUnits);
  } catch (error) {
    console.log(`Error while getting housing units. Error: ${error}`);
  }
});

export default getHousingUnits;
