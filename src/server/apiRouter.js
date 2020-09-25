import { get } from 'lodash';

import { handleCaseIdParam } from './handlers/paramHandler';
import { addRoutesToRouter } from './apiRoutes';
import API_ROUTES from './apiRoutes';
import allConfigs from './config/config';

import jwtCheck from './handlers/jwtCheck';
import verifyUserInfo from './handlers/verifyUserNickname';
import authErrorHandler from './handlers/authErrorHandler';
import localhostUserNickname from './handlers/localhostUserNickname';

const { NODE_ENV } = process.env || {};
const currentConfig = allConfigs[NODE_ENV];

const express = require('express');
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

router.param('caseId', handleCaseIdParam);

//Routes defined in API_ROUTES and below will require authentication
addRoutesToRouter(router, API_ROUTES);

module.exports = router;
