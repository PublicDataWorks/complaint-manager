import { get } from 'lodash';

import allConfigs from "../server/config/config";

import jwtCheck from '../server/handlers/jwtCheck';
import verifyUserInfo from '../server/handlers/verifyUserNickname';
import authErrorHandler from '../server/handlers/authErrorHandler';
import localhostUserNickname from '../server/handlers/localhostUserNickname';

const { NODE_ENV } = process.env || {};
const currentConfig = allConfigs[NODE_ENV];

const express = require("express");
const router = express.Router();

const isLowerEnv = ['development', 'test'].includes(NODE_ENV);
const isAuthDisabled = get(currentConfig, ['authentication', 'disabled'], false);

if (isLowerEnv && isAuthDisabled) {
  router.use(localhostUserNickname);
} else {
  router.use(jwtCheck);
  router.use(verifyUserInfo);
  router.use(authErrorHandler);
}

module.exports = router;
