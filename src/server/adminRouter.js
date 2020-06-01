const jwtCheck = require("./handlers/jtwCheck");
const auth0UserService = require("./services/auth0UserService");

const express = require("express");
const router = express.Router();

router.use(jwtCheck);

router.delete("/cache/users", (request, response) => {
    if (auth0UserService.delCacheUsers()) {
        response.sendStatus(200);
    } else {
        response.sendStatus(204);
    }
})

module.exports = router;
