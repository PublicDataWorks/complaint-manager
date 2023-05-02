import { suppressWinstonLogs } from "./testHelpers/requestTestHelpers";
import { retrieveSecretFromAWS } from "./retrieveSecretFromAWS";
import { INTERNAL_ERRORS } from "../sharedUtilities/errorMessageConstants";
import Boom from "boom";

const createConfiguredSecretsManagerInstance = require("./createConfiguredSecretsManagerInstance");

jest.mock("./createConfiguredSecretsManagerInstance");

describe("retrieveSecretFromAWS tests", () => {
  const promiseSecretString = `{"AUTH0_CLIENT_SECRET" : "fake yum yum wings"}`;
  let mockSecretId;

  beforeEach(() => {
    mockSecretId = jest.fn();
    createConfiguredSecretsManagerInstance.mockReset();
    createConfiguredSecretsManagerInstance.mockImplementation(() => ({
      getSecretValue: jest.fn(() =>
        Promise.resolve({ SecretString: promiseSecretString })
      )
    }));
  });

  describe("AWS secret manager", () => {
    test(
      "should successfully retrieve Auth0 key",
      suppressWinstonLogs(async () => {
        const spy = jest.spyOn(JSON, "parse");
        await retrieveSecretFromAWS(mockSecretId);
        expect(spy).toHaveBeenCalledWith(promiseSecretString);
        spy.mockRestore();
      })
    );
  });

  describe("Error Handling", () => {
    test(
      "should throw error if secret cannot be retrieved from Secrets Manager",
      suppressWinstonLogs(async () => {
        createConfiguredSecretsManagerInstance.mockReset();
        createConfiguredSecretsManagerInstance.mockImplementation(() => ({
          getSecretValue: jest.fn(() =>
            Promise.reject({ code: "InternalServiceErrorException" })
          )
        }));

        await expect(retrieveSecretFromAWS(mockSecretId)).rejects.toEqual(
          Boom.badData(INTERNAL_ERRORS.USER_MANAGEMENT_API_GET_USERS_FAILURE)
        );
      })
    );
  });
});
