import models from "./policeDataManager/models";
const asyncMiddleware = require("./handlers/asyncMiddleware");
const fflip = require("fflip");
const FFlipExpressIntegration = require("fflip-express");
const fflipExpress = new FFlipExpressIntegration(fflip);
const express = require("express");
const router = express.Router();

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

const criteria = [
  {
    id: "off",
    check: false
  }
];

fflip.config({
  features: getFeaturesAsync,
  criteria,
  reload: 120
});

router.use(fflipExpress.middleware);
router.use((request, response, next) => {
  request.fflip.setForUser();
  next();
});

// only allow browser to toggle features in non-prod environments
if (process.env.NODE_ENV !== "production") {
  router.get("/features/:name/:action", fflipExpress.manualRoute);
}

// allow production environment application to have access to feature toggle values
router.get(
  "/features/",
  asyncMiddleware((request, response) => {
    response.status(200).send(request.fflip.features);
  })
);

module.exports = router;
module.exports.getFeaturesAsync = getFeaturesAsync;
