const fflip = require("fflip");
const FFlipExpressIntegration = require("fflip-express");
const fflipExpress = new FFlipExpressIntegration(fflip);
const express = require("express");
const router = express.Router();
const asyncMiddleware = require("./handlers/asyncMiddleware");

const features = require("./config/features");
const criteria = [
  {
    id: "isPreProd",
    check: user => process.env.NODE_ENV !== "production"
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

if (process.env.NODE_ENV !== "production") {
  router.get("/features/:name/:action", fflipExpress.manualRoute);
  router.get(
    "/features/",
    asyncMiddleware((request, response) => {
      response.status(200).send(request.fflip.features);
    })
  );
}

module.exports = router;
