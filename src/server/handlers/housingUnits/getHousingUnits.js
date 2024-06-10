import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";

const getHousingUnits = asyncMiddleware(async (request, response, next) => {
  response.status(200).send(await models.housing_unit.findAll({
    where: { facility_id: request.query.facilityId }
  }));
});

export default getHousingUnits;
