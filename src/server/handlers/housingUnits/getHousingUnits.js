import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";

const getHousingUnits = asyncMiddleware(async (request, response, next) => {
  try {
    const housingUnits = await models.housing_unit.findAll({
      where: { facility_id: request.query.facilityId }
    });

    response.status(200).send(housingUnits);
  } catch (error) {
    console.log(`Error while getting housing units. Error: ${error}`);
  }
});

export default getHousingUnits;
