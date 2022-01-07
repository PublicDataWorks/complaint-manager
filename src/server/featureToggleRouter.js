const fflip = require("fflip");
const FFlipExpressIntegration = require("fflip-express");
const fflipExpress = new FFlipExpressIntegration(fflip);
const express = require("express");
const router = express.Router();
const asyncMiddleware = require("./handlers/asyncMiddleware");

const features = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/features`);
const criteria = [
  {
    id: "isPreProd",
    check: user => process.env.NODE_ENV !== "production"
  },
  {
    id: "off",
    check: false
  }
];

fflip.config({
  features,
  criteria
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
