import axios from "axios";
import _ from "lodash";
import { INTERNAL_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import auditDataAccess from "../../../handlers/audits/auditDataAccess";
import models from "../../../complaintManager/models";
import {
  ASCENDING,
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import { retrieveSecretFromAWS } from "../../../retrieveSecretFromAWS";

const config = require("../../../config/config")[process.env.NODE_ENV];
const asyncMiddleware = require("../../../handlers/asyncMiddleware");
const Boom = require("boom");
const winston = require("winston");
let globalNext;

const getUsers = asyncMiddleware(async (request, response, next) => {
  globalNext = next;

  const transformedUserData = await getUsersFromAuth0();
  await models.sequelize
    .transaction(async transaction => {
      await auditDataAccess(
        request.nickname,
        null,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.ALL_USER_DATA,
        { users: { attributes: ["name", "email"] } },
        transaction
      );
    })
    .catch(err => {
      // Transaction has been rolled back
      throw err;
    });

  response.send(200, transformedUserData);
});

export const getUsersFromAuth0 = async () => {
  let authResponse;
  let userData = [];
  let secret;

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    secret = await retrieveSecretFromAWS("ci/auth0/backend");
  } else {
    secret = process.env.AUTH0_CLIENT_SECRET;
  }

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
    .then(async response => {
      authResponse = response.data;
    })
    .catch(error => {
      winston.error(INTERNAL_ERRORS.USER_MANAGEMENT_API_TOKEN_FAILURE, error);
      throwTokenFailure(globalNext, error);
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

  return transformedUserData;
};

const throwTokenFailure = (next, error) => {
  throw Boom.badImplementation(
    INTERNAL_ERRORS.USER_MANAGEMENT_API_TOKEN_FAILURE,
    error
  );
};

const transformAndSortUserData = userData => {
  const transformedUserData = userData.map(userInfo => {
    return _.pick(userInfo, ["email", "name"]);
  });

  return transformedUserData.sort((first, second) =>
    first.name.toLowerCase() > second.name.toLowerCase() ? 1 : -1
  );
};

export default getUsers;
