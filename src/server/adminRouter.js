const jwtCheck = require("./handlers/jwtCheck");
const userService = require("./services/userService");
const oktaJwtCheck = require("./handlers/jwtCheck.okta");
const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`)[
    process.env.NODE_ENV
  ];
const { OKTA } = require("../sharedUtilities/constants");

const express = require("express");
const router = express.Router();

router.use(
  config.authentication.engine === OKTA && process.env.NODE_ENV !== "test"
    ? oktaJwtCheck
    : jwtCheck
);

router.delete("/cache/users", (request, response) => {
  if (userService.delCacheUsers()) {
    response.sendStatus(200);
  } else {
    response.sendStatus(204);
  }
});

module.exports = router;
