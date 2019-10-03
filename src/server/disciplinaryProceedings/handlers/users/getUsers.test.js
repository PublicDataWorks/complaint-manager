import nock from "nock";
import httpMocks from "node-mocks-http";
import getUsers from "./getUsers";
import { AUDIT_SUBJECT } from "../../../../sharedUtilities/constants";
import auditDataAccess from "../../../handlers/audits/auditDataAccess";
const AWS = require("aws-sdk");
const createConfiguredSecretsManagerInstance = require("../../../createConfiguredSecretsManagerInstance");

jest.mock("../../../handlers/audits/auditDataAccess");
jest.mock("aws-sdk");
jest.mock("../../../createConfiguredSecretsManagerInstance");

describe("getUsers tests", () => {
  const dummyToken = "fakeToken";
  const clientSecret = "success";
  const promiseSecretString = `{"AUTH0_CLIENT_SECRET" : "${clientSecret}"}`;

  let mockGetUserRequest, mockGetUserResponse, next;

  beforeEach(() => {
    mockGetUserRequest = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      nickname: "nickname"
    });
    mockGetUserResponse = httpMocks.createResponse();
    next = jest.fn();
    process.env.NODE_ENV = "development";
    createConfiguredSecretsManagerInstance.mockImplementation(() => ({
      getSecretValue: jest.fn(() => ({
        promise: () => Promise.resolve({ "SecretString": promiseSecretString })
      }))
    }));
  });

  const userResponse = {
    email: "john.doe@thoughtworks.com",
    email_verified: true,
    updated_at: "2019-09-11T20:39:29.343Z",
    user_id: "auth0|5d3jhgfjhfggfdd87dsfsdf0ec234324",
    name: "john.doe@thoughtworks.com",
    picture: "",
    nickname: "john.doe",
    identities: [
      {
        user_id: "5d3jhgfjhfggfdd87dsfsdf0ec234324",
        provider: "auth0",
        connection: "Username-Password-Authentication",
        isSocial: false
      }
    ],
    created_at: "2019-07-22T21:44:12.987Z",
    last_password_reset: "2019-08-01T21:13:11.665Z",
    last_login: "2019-09-11T20:39:29.343Z",
    last_ip: "0.5.55.1",
    logins_count: 12
  };

  describe("AWS secret manager", () => {
    test("should successfully retrieve Auth0 key", async () => {
      const spy = jest.spyOn(JSON, 'parse');
      await getUsers(mockGetUserRequest, mockGetUserResponse, next);
      expect(spy).toHaveBeenCalledWith(promiseSecretString);
      spy.mockRestore();
    });
  });

  describe("Successful path", () => {
    let tokenCall, getUsersCall;

    beforeEach(async () => {
      tokenCall = nock("https://noipm-ci.auth0.com", {
        reqheaders: {
          "content-type": "application/json"
        }
      })
        .post("/oauth/token", {
          grant_type: "client_credentials",
          client_id: "iT3f0mGqJGDZu8UzQaOHeNGT7O0x43ZB",
          client_secret: clientSecret,
          audience: "https://noipm-ci.auth0.com/api/v2/"
        })
        .reply(200, {
          access_token: dummyToken,
          expires_in: 86400,
          scope: "read:users",
          token_type: "Bearer"
        });

      getUsersCall = nock("https://noipm-ci.auth0.com", {
        reqheaders: {
          authorization: `Bearer ${dummyToken}`
        }
      })
        .get("/api/v2/users")
        .query({ search_engine: "v3" })
        .reply(200, [userResponse]);
    });

    test("should call auth0 token api to get bearer token", async () => {
      await getUsers(mockGetUserRequest, mockGetUserResponse, next);
      expect(tokenCall.isDone()).toBeTrue();
    });

    test("should call get_users endpoint from auth0 management api", async () => {
      await getUsers(mockGetUserRequest, mockGetUserResponse, next);

      expect(getUsersCall.isDone()).toBeTrue();
    });

    test("should get users from auth0 api", async () => {
      await getUsers(mockGetUserRequest, mockGetUserResponse, next);

      expect(mockGetUserResponse._getData()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: userResponse.email,
            name: userResponse.name
          })
        ])
      );
    });
  });

  describe("Error Handling", () => {
    test("should throw error if secret cannot be retrieved from Secrets Manager", async () => {
      createConfiguredSecretsManagerInstance.mockReset();
      createConfiguredSecretsManagerInstance.mockImplementation(() => ({
        getSecretValue: jest.fn(() => ({
          promise: () => Promise.reject({code: "InternalServiceErrorException"})
        }))
      }));

      await getUsers(mockGetUserRequest, mockGetUserResponse, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "An error occurred on the server side.",
        })
      );
    });
    test("should throw error if it cannot retrieve authentication token", async () => {
      const customError = "YIKES";
      nock("https://noipm-ci.auth0.com", {
        reqheaders: {
          "content-type": "application/json"
        }
      })
        .post("/oauth/token", {
          grant_type: "client_credentials",
          client_id: "iT3f0mGqJGDZu8UzQaOHeNGT7O0x43ZB",
          client_secret: clientSecret,
          audience: "https://noipm-ci.auth0.com/api/v2/"
        })
        .replyWithError({ message: customError, code: 500 });

      await getUsers(mockGetUserRequest, mockGetUserResponse, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Could not retrieve user management api token",
          data: expect.objectContaining({
            message: `${customError}`
          })
        })
      );
    });

    test("should throw error if it cannot retrieve user data", async () => {
      nock("https://noipm-ci.auth0.com", {
        reqheaders: {
          "content-type": "application/json"
        }
      })
        .post("/oauth/token", {
          grant_type: "client_credentials",
          client_id: "iT3f0mGqJGDZu8UzQaOHeNGT7O0x43ZB",
          client_secret: clientSecret,
          audience: "https://noipm-ci.auth0.com/api/v2/"
        })
        .reply(200, {
          access_token: dummyToken,
          expires_in: 86400,
          scope: "read:users",
          token_type: "Bearer"
        });

      const customError = "OOF";

      nock("https://noipm-ci.auth0.com", {
        reqheaders: {
          authorization: `Bearer ${dummyToken}`
        }
      })
        .get("/api/v2/users")
        .query({ search_engine: "v3" })
        .replyWithError({ message: customError, code: 500 });
      await getUsers(mockGetUserRequest, mockGetUserResponse, next);

      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Could not retrieve user data from authentication server",
          data: expect.objectContaining({
            message: customError
          })
        })
      );
    });
  });

  describe("Auditing", () => {
    beforeEach(() => {
      nock("https://noipm-ci.auth0.com", {
        reqheaders: {
          "content-type": "application/json"
        }
      })
        .post("/oauth/token", {
          grant_type: "client_credentials",
          client_id: "iT3f0mGqJGDZu8UzQaOHeNGT7O0x43ZB",
          client_secret: clientSecret,
          audience: "https://noipm-ci.auth0.com/api/v2/"
        })
        .reply(200, {
          access_token: dummyToken,
          expires_in: 86400,
          scope: "read:users",
          token_type: "Bearer"
        });

      nock("https://noipm-ci.auth0.com", {
        reqheaders: {
          authorization: `Bearer ${dummyToken}`
        }
      })
        .get("/api/v2/users")
        .query({ search_engine: "v3" })
        .reply(200, [userResponse]);
    });

    test("Should audit when accessing user data", async () => {
      await getUsers(mockGetUserRequest, mockGetUserResponse, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        mockGetUserRequest.nickname,
        null,
        AUDIT_SUBJECT.ALL_USER_DATA,
        { users: { attributes: ["name", "email"] } },
        expect.anything()
      );
    });

    test("Should throw error if audit fails", async () => {
      auditDataAccess.mockImplementation(() => {
        throw new Error("I am failing!");
      });

      await getUsers(mockGetUserRequest, mockGetUserResponse, next);

      expect(next).toHaveBeenCalledWith(new Error("I am failing!"));
    });
  });
});
