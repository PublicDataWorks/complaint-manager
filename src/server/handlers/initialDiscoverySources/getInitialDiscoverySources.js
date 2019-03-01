import asyncMiddleware from "../asyncMiddleware";
import models from "../../models";

const getInitialDiscoverySources = asyncMiddleware(
  async (request, response, next) => {
    const initialDiscoverySources = await getSortedInitialDiscoverySources();
    const initialDiscoverySourceValues = initialDiscoverySources.map(
      initialDiscoverySource => {
        return [initialDiscoverySource.name, initialDiscoverySource.id];
      }
    );
    response.status(200).send(initialDiscoverySourceValues);
  }
);

const getSortedInitialDiscoverySources = async () => {
  return await models.initial_discovery_source.findAll({
    attributes: ["name", "id"],
    order: [["name", "ASC"]],
    raw: true
  });
};

export default getInitialDiscoverySources;
