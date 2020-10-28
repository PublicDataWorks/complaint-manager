import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";
import { ASCENDING } from "../../../sharedUtilities/constants";

const getIntakeSources = asyncMiddleware(async (request, response, next) => {
  const intakeSources = await getSortedIntakeSources();
  const intakeSourceValues = intakeSources.map(intakeSource => {
    return [intakeSource.name, intakeSource.id];
  });
  response.status(200).send(intakeSourceValues);
});

const getSortedIntakeSources = async () => {
  return await models.intake_source.findAll({
    attributes: ["name", "id"],
    order: [["name", ASCENDING]],
    raw: true
  });
};

export default getIntakeSources;
