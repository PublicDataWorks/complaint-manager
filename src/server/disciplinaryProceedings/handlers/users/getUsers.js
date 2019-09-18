import axios from "axios";
import _ from "lodash";
import { INTERNAL_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import auditDataAccess from "../../../handlers/audits/auditDataAccess";
import models from "../../../models";
import { AUDIT_SUBJECT } from "../../../../sharedUtilities/constants";

const querystring = require("querystring");
const config = require("../../../config/config")[process.env.NODE_ENV];
const asyncMiddleware = require("../../../handlers/asyncMiddleware");
const httpRequest = require("request");
const Boom = require("boom");

const getUsers = asyncMiddleware(async (request, response, next) => {
  let authResponse;
  let userData = [];

  await axios
    .post(
      `https://${config.authentication.domain}/oauth/token`,
      {
        grant_type: "client_credentials",
        client_id: config.authentication.clientID,
        client_secret: process.env.AUTH0_CLIENT_SECRET,
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
      return throwTokenFailure(next, error);
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
      .then(reponse => {
        userData = reponse.data;
      })
      .catch(error => {
        return next(
          Boom.badImplementation(
            INTERNAL_ERRORS.USER_MANAGEMENT_API_GET_USERS_FAILURE,
            error
          )
        );
      });
  } else {
    return throwTokenFailure(next);
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
      console.error(err);
      throw err;
    });

  response.send(200, transformedUserData);
});

const throwTokenFailure = (next, error) => {
  return next(
    Boom.badImplementation(
      INTERNAL_ERRORS.USER_MANAGEMENT_API_TOKEN_FAILURE,
      error
    )
  );
};

export default getUsers;
