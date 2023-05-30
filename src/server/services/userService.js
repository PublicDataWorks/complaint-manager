import axios from "axios";
import _ from "lodash";
import Boom from "boom";
import { retrieveSecretFromAWS } from "../retrieveSecretFromAWS";
import { INTERNAL_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import NodeCache from "node-cache";
import {
  TTL_SEC,
  AUTH0_USERS_CACHE_KEY,
  FAKE_USERS,
  OKTA
} from "../../sharedUtilities/constants";
import { isAuthDisabled } from "../isAuthDisabled";
import okta from "@okta/okta-sdk-nodejs";

const winston = require("winston");
const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`)[
    process.env.NODE_ENV
  ];
const key = AUTH0_USERS_CACHE_KEY;

let users;
let cache = new NodeCache({ stdTTL: TTL_SEC });

export const delCacheUsers = () => {
  if (cache.has(key)) {
    return cache.del(key);
  }
};

export const getUsers = async () => {
  if (isAuthDisabled()) {
    return FAKE_USERS;
  }

  if (cache.has(key)) {
    users = cache.get(key);
    if (users) return users;
  }

  let authResponse;
  let userData = [];
  let secret = await getClientSecret();

  if (config.authentication.engine === OKTA) {
    const client = new okta.Client({
      orgUrl: `https://${config.authentication.domain}`,
      token: secret
    });

    const collection = await client.userApi.listUsers();
    await collection.each(user => {
      const fullName = user.profile.firstName + " " + user.profile.lastName;
      userData.push({ email: user.profile.email, name: fullName });
    });
    cache.set(key, userData);
    return userData;
  } else {
    await axios
      .post(
        `https://${config.authentication.domain}/oauth/token`,
        {
          grant_type: "client_credentials",
          client_id: config.authentication.clientID,
          client_secret: secret,
          audience: `https://${config.authentication.domain}/api/v2/`
        },
        {
          headers: { "content-type": "application/json" }
        }
      )
      .then(response => {
        authResponse = response.data;
      })
      .catch(error => {
        winston.error(INTERNAL_ERRORS.USER_MANAGEMENT_API_TOKEN_FAILURE, error);
        throwTokenFailure(error);
      });

    if (authResponse && authResponse.access_token) {
      await axios
        .get(`https://${config.authentication.domain}/api/v2/users`, {
          params: {
            search_engine: "v3"
          },
          headers: {
            authorization: `Bearer ${authResponse.access_token}`
          }
        })
        .then(response => {
          userData = response.data;
        })
        .catch(error => {
          winston.error(
            INTERNAL_ERRORS.USER_MANAGEMENT_API_GET_USERS_FAILURE,
            error
          );
          throw Boom.badImplementation(
            INTERNAL_ERRORS.USER_MANAGEMENT_API_GET_USERS_FAILURE,
            error
          );
        });
    }
    const transformedUserData = transformAndSortUserData(userData);
    cache.set(key, transformedUserData);

    return transformedUserData;
  }
};

const getClientSecret = async () => {
  const secretKey =
    config.authentication.engine === OKTA
      ? "OKTA_CLIENT_SECRET"
      : "AUTH0_CLIENT_SECRET";
  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    return await retrieveSecretFromAWS(
      `ci/${config.authentication.engine}/backend`,
      secretKey
    );
  } else {
    return process.env[secretKey];
  }
};

const transformAndSortUserData = userData => {
  const transformedUserData = userData.map(userInfo => {
    return _.pick(userInfo, ["email", "name"]);
  });

  return transformedUserData.sort((first, second) =>
    first.name.toLowerCase() > second.name.toLowerCase() ? 1 : -1
  );
};

const throwTokenFailure = error => {
  throw Boom.badImplementation(
    INTERNAL_ERRORS.USER_MANAGEMENT_API_TOKEN_FAILURE,
    error
  );
};
