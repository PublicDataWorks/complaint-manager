import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";

const getComplaintTypes = asyncMiddleware(async (request, response, next) => {
  const complaints = await models.complaintTypes.findAll({
    attributes: ["name"]
  });
  response.status(200).send(complaints);
});

export default getComplaintTypes;
