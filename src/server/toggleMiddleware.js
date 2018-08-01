const fflip = require("fflip");
const FFlipExpressIntegration = require("fflip-express");
const fflipExpress = new FFlipExpressIntegration(fflip);
const express = require("express");
const router = express.Router();

const features = [
  {
    id: "experimentalFeature",
    name: "AnExperimentalFeature",
    description: "This is a test feature to show config",
    enabled: true
  }
];

fflip.config({
  features,
  criteria: []
});

fflipExpress.connectAll(router);
router.use((request, response, next) => {
  request.fflip.setForUser();
  next();
});

module.exports = router;
