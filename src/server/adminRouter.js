const { jwtCheck } = require("../auth");
const userService = require("./services/userService");

const express = require("express");
const router = express.Router();

router.use(jwtCheck);

router.delete("/cache/users", (request, response) => {
  if (userService.delCacheUsers()) {
    response.sendStatus(200);
  } else {
    response.sendStatus(204);
  }
});

module.exports = router;
