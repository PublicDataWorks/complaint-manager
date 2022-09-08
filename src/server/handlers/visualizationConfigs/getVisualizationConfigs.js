import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";

const getVisualizationConfigs = asyncMiddleware(
  async (request, response, next) => {
    const visualizations = await models.publicDataVisualization.findAll({
      order: [["orderKey", "ASC"]]
    });
    response.status(200).send(visualizations);
  }
);

export default getVisualizationConfigs;
