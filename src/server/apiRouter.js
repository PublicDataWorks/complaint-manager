import { handleCaseIdParam } from "./handlers/paramHandler";
import { addRoutesToRouter } from "./apiRoutes";
import API_ROUTES from "./apiRoutes";

const jwtCheck = require("./handlers/jwtCheck");
const verifyUserInfo = require("./handlers/verifyUserNickname");
const authErrorHandler = require("./handlers/authErrorHandler");

const express = require("express");
const router = express.Router();

router.use(jwtCheck);
router.use(verifyUserInfo);
router.use(authErrorHandler);

router.param("caseId", handleCaseIdParam);

//Routes defined in API_ROUTES and below will require authentication
addRoutesToRouter(router, API_ROUTES);

module.exports = router;
