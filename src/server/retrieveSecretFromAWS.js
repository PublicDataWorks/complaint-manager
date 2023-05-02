import createConfiguredSecretsManagerInstance from "./createConfiguredSecretsManagerInstance";
import {
  AWS_ERRORS,
  INTERNAL_ERRORS
} from "../sharedUtilities/errorMessageConstants";
const Boom = require("boom");
const winston = require("winston");

export const retrieveSecretFromAWS = async secretID => {
  winston.info(`About to request ${secretID} from AWS Secrets Manager`);
  let secret;
  let secretsManager = createConfiguredSecretsManagerInstance();
  const response = secretsManager.getSecretValue({
    SecretId: secretID
  });

  return await response
    .then(data => {
      if ("SecretString" in data) {
        secret = JSON.parse(data.SecretString);
      } else {
        let buff = new Buffer(data.SecretBinary, "base64");
        secret = buff.toString("ascii");
      }
      if (secret) {
        winston.info(
          `Successfully retrieved ${secretID} from AWS Secrets Manager`
        );

        return secret.AUTH0_CLIENT_SECRET;
      } else {
        winston.info(`Not an error, but ${secretID} is undefined`);

        return "Secret is undefined";
      }
    })
    .catch(error => {
      winston.error("I failed :( ", error);
      if (error.code === "DecryptionFailureException") {
        winston.error(`${AWS_ERRORS.DECRYPTION_FAILURE_EXCEPTION}`);
        throw Boom.badImplementation(
          INTERNAL_ERRORS.USER_MANAGEMENT_API_GET_USERS_FAILURE,
          error
        );
      } else if (error.code === "InternalServiceErrorException") {
        winston.error(`${AWS_ERRORS.INTERNAL_SERVICE_ERROR_EXCEPTION}`);
        throw Boom.badImplementation(
          INTERNAL_ERRORS.USER_MANAGEMENT_API_GET_USERS_FAILURE,
          error
        );
      } else if (error.code === "InvalidParameterException") {
        winston.error(`${AWS_ERRORS.INVALID_PARAMETER_EXCEPTION}`);
        throw Boom.badImplementation(
          INTERNAL_ERRORS.USER_MANAGEMENT_API_GET_USERS_FAILURE,
          error
        );
      } else if (error.code === "InvalidRequestException") {
        winston.error(`${AWS_ERRORS.INVALID_REQUEST_EXCEPTION}`);
        throw Boom.badImplementation(
          INTERNAL_ERRORS.USER_MANAGEMENT_API_GET_USERS_FAILURE,
          error
        );
      } else if (error.code === "ResourceNotFoundException") {
        winston.error(`${AWS_ERRORS.RESOURCE_NOT_FOUND_EXCEPTION}`);
        throw Boom.badImplementation(
          INTERNAL_ERRORS.USER_MANAGEMENT_API_GET_USERS_FAILURE,
          error
        );
      }
    });
};
