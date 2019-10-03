import axios from "axios";
import _ from "lodash";
import {
  AWS_ERRORS,
  INTERNAL_ERRORS
} from "../../../../sharedUtilities/errorMessageConstants";
import auditDataAccess from "../../../handlers/audits/auditDataAccess";
import models from "../../../models";
import { AUDIT_SUBJECT } from "../../../../sharedUtilities/constants";
import createConfiguredSecretsManagerInstance from "../../../createConfiguredSecretsManagerInstance";

const querystring = require("querystring");
const config = require("../../../config/config")[process.env.NODE_ENV];
const asyncMiddleware = require("../../../handlers/asyncMiddleware");
const httpRequest = require("request");
const Boom = require("boom");

const getUsers = asyncMiddleware(async (request, response, next) => {
  let authResponse;
  let userData = [];
  let secret;

  if (
    process.env.NODE_ENV === "development" ||
    process.env.NODE_ENV === "test"
  ) {
    secret = await retrieveClientSecretFromAWS("ci/auth0/backend");
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
      throwTokenFailure(next, error);
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
        throw Boom.badImplementation(
          INTERNAL_ERRORS.USER_MANAGEMENT_API_GET_USERS_FAILURE,
          error
        );
      });
  }

  const transformedUserData = userData.map(userInfo => {
    return _.pick(userInfo, ["email", "name"]);
  });

  await models.sequelize
    .transaction(async transaction => {
      await auditDataAccess(
        request.nickname,
        null,
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

const throwTokenFailure = (next, error) => {
  throw Boom.badImplementation(
    INTERNAL_ERRORS.USER_MANAGEMENT_API_TOKEN_FAILURE,
    error
  );
};

const retrieveClientSecretFromAWS = async secretID => {
  let secret;
  let secretsManager = createConfiguredSecretsManagerInstance();
  const response = secretsManager.getSecretValue({
    SecretId: secretID
  });
  const result = response.promise();
  return await result
    .then(data => {
      if ("SecretString" in data) {
        secret = JSON.parse(data.SecretString);
      } else {
        let buff = new Buffer(data.SecretBinary, "base64");
        secret = buff.toString("ascii");
      }
      if (secret) {
        return secret.AUTH0_CLIENT_SECRET;
      } else {
        return "Secret is undefined";
      }
    })
    .catch(error => {
      console.error("I failed :(", error);
      if (error.code === "DecryptionFailureException")
        throw Boom.badImplementation(
          AWS_ERRORS.DECRYPTION_FAILURE_EXCEPTION,
          error
        );
      else if (error.code === "InternalServiceErrorException")
        throw Boom.badImplementation(
          AWS_ERRORS.INTERNAL_SERVICE_ERROR_EXCEPTION,
          error
        );
      else if (error.code === "InvalidParameterException")
        throw Boom.badImplementation(
          AWS_ERRORS.INVALID_PARAMETER_EXCEPTION,
          error
        );
      else if (error.code === "InvalidRequestException")
        throw Boom.badImplementation(
          AWS_ERRORS.INVALID_REQUEST_EXCEPTION,
          error
        );
      else if (error.code === "ResourceNotFoundException")
        throw Boom.badImplementation(
          AWS_ERRORS.RESOURCE_NOT_FOUND_EXCEPTION,
          error
        );
    });
};

export default getUsers;
