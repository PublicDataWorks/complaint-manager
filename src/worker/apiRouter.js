import { jwtCheck } from "../auth";
import verifyUserInfo from "../server/handlers/verifyUserNickname";
import authErrorHandler from "../server/handlers/authErrorHandler";
import localhostUserNickname from "../server/handlers/localhostUserNickname";
import { isAuthDisabled } from "../server/isAuthDisabled";

const express = require("express");
const router = express.Router();

if (isAuthDisabled()) {
  router.use(localhostUserNickname);
} else {
  router.use(jwtCheck);
  router.use(verifyUserInfo);
  router.use(authErrorHandler);
}

module.exports = router;
