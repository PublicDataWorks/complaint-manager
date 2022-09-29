const models = require("./policeDataManager/models");

const getFeaturesAsync = callback => {
  const queryOptions = {
    attributes: ["name", "description", "enabled"]
  };
  models.feature_toggles.findAll(queryOptions).then(features => {
    callback(
      features.map(feature => {
        const result = {
          id: feature.name,
          name: feature.name,
          description: feature.description,
          enabled: feature.enabled
        };
        return result;
      })
    );
  });
};

module.exports = getFeaturesAsync;
