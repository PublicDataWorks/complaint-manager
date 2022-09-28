import models from "./policeDataManager/models";

const getFeaturesAsync = callback => {
  const queryOptions = {
    attributes: ["name", "description", "enabled"]
  };
  models.feature_toggles.findAll(queryOptions).then(features => {
    callback(
      features.map(feature => ({
        id: feature.name,
        name: feature.name,
        description: feature.description,
        enabled: feature.enabled
      }))
    );
  });
};

export default getFeaturesAsync;
