import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";

const retrievePersonTypes = asyncMiddleware(async (request, response) => {
  const personTypes = await models.personType.findAll({
    attributes: [
      "abbreviation",
      "description",
      "dialogAction",
      "employeeDescription",
      "isDefault",
      "isEmployee",
      "key",
      "legend",
      "subTypes"
    ],
    auditUser: request.nickname
  });

  response.status(200).send(personTypes);
});

export default retrievePersonTypes;
