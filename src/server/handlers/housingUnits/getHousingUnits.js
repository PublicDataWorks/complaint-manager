import asyncMiddleware from "../asyncMiddleware";

const getHousingUnits = asyncMiddleware(async (request, response, next) => {
  response.status(200).send({});
});

export default getHousingUnits;
