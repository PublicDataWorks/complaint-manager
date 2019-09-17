import axios from "axios";
import _ from "lodash";
import { INTERNAL_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const querystring = require("querystring");
const config = require("../../../config/config")[process.env.NODE_ENV];
const asyncMiddleware = require("../../../handlers/asyncMiddleware");
const httpRequest = require("request");
const Boom = require("Boom");

const getUsers = asyncMiddleware(async (request, response, next) => {
  let authResponse;
  let userData = [];

  await axios
    .post(
      `https://${config.authentication.domain}/oauth/token`,
      {
        form: {
          grant_type: "client_credentials",
          client_id: config.authentication.clientID,
          client_secret: process.env.AUTH0_CLIENT_SECRET,
          audience: `https://${config.authentication.domain}/api/v2/`
        }
      },
      {
        headers: { "content-type": "application/x-www-form-urlencoded" }
      }
    )
    .then(async response => {
      authResponse = response.data;
    })
    .catch(error => {
      return next(
        Boom.badImplementation(
          INTERNAL_ERRORS.USER_MANAGEMENT_API_TOKEN_FAILURE
        )
      );
    });

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
          INTERNAL_ERRORS.USER_MANAGEMENT_API_GET_USERS_FAILURE
        )
      );
    });

  const transformedUserData = userData.map(userInfo => {
    return _.pick(userInfo, ["email", "name"]);
  });

  response.send(200, transformedUserData);
});

export default getUsers;
