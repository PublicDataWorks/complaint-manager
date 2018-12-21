import asyncMiddleware from "../asyncMiddleware";
import models from "../../models";

const getIntakeSources = asyncMiddleware(async (request, response, next) => {
  const intakeSources = await getSortedIntakeSources();
  const intakeSourceValues = intakeSources.map(intakeSource => {
    return [intakeSource.name, intakeSource.id];
  });
  response.status(200).send(intakeSourceValues);
});

const getSortedIntakeSources = async () => {
  const intakeSources = await models.intake_source.findAll({
    attributes: ["name", "id"],
    order: [["name", "ASC"]],
    raw: true
  });
  return intakeSources;
};

export default getIntakeSources;
