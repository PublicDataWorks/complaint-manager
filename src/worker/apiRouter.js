const jwtCheck = require("../server/handlers/jwtCheck");

const verifyUserInfo = require("../server/handlers/verifyUserNickname");
const authErrorHandler = require("../server/handlers/authErrorHandler");

const express = require("express");
const router = express.Router();

router.use(jwtCheck);
router.use(verifyUserInfo);
router.use(authErrorHandler);

//Any routes defined below this point will require authentication

module.exports = router;
