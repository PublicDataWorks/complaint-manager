import { handleCaseIdParam } from "./handlers/paramHandler";
import { addRoutesToRouter } from "./apiRoutes";
import { PUBLIC_ROUTES, API_ROUTES } from "./apiRoutes";
import jwtCheck from "./handlers/jwtCheck";
import oktaJwtCheck from "./handlers/jwtCheck.okta";
import verifyUserInfo from "./handlers/verifyUserNickname";
import authErrorHandler from "./handlers/authErrorHandler";
import localhostUserNickname from "./handlers/localhostUserNickname";
import { isAuthDisabled } from "./isAuthDisabled";
import { OKTA } from "../sharedUtilities/constants";

const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`)[
    process.env.NODE_ENV
  ];

const express = require("express");
const router = express.Router();

addRoutesToRouter(router, PUBLIC_ROUTES);

if (isAuthDisabled()) {
  router.use(localhostUserNickname);
} else {
  router.use(
    config.authentication.engine === OKTA && process.env.NODE_ENV !== "test"
      ? oktaJwtCheck
      : jwtCheck
  );
  router.use(verifyUserInfo);
  router.use(authErrorHandler);
}

router.param("caseId", handleCaseIdParam);

//Routes defined in API_ROUTES and below will require authentication
addRoutesToRouter(router, API_ROUTES);

module.exports = router;
