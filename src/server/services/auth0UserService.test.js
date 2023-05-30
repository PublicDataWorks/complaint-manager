import nock from "nock";
import Boom from "boom";

const userService = require("./userService");
import { suppressWinstonLogs } from "../testHelpers/requestTestHelpers";
import { INTERNAL_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import { authEnabledTest } from "../testHelpers/authEnabledTest";

jest.mock(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`, () => {
  return {
    test: {
      host: process.env.CIRCLECI ? "localhost" : "db",
      s3Bucket: "noipm-local",
      port: 5432,
      exportsBucket: "noipm-exports-test",
      referralLettersBucket: "noipm-referral-letters-test",
      complainantLettersBucket: "noipm-complainant-letters-test",
      authentication: {
        engine: "auth0",
        clientID: "FAKEDATA01010101",
        domain: "noipm-ci.auth0.com",
        audience: "test audience",
        issuer: "test issuer",
        algorithm: "RS256",
        scope: "openid profile",
        nicknameKey: "https://noipm-ci.herokuapp.com/nickname"
      },
      contentSecurityPolicy: {
        connectSrc: [
          "'self'",
          "https://noipm-ci.auth0.com",
          "https://a.tile.openstreetmap.org",
          "https://b.tile.openstreetmap.org",
          "https://api.mapbox.com",
          "https://www.google-analytics.com",
          "https://api.github.com",
          `wss://localhost:443`
        ]
      },
      corsOrigin: "*",
      winston: {
        logLevel: "error",
        json: true
      },
      queue: {
        host: "redis",
        port: 6379,
        failedJobAttempts: 1,
        exponentialDelay: 60 * 1000,
        jobTimeToLive: 120 * 1000,
        jobUIPort: 5000
      }
    }
  };
});
jest.mock("../../server/retrieveSecretFromAWS", () => {
  return {
    retrieveSecretFromAWS: jest.fn(() => {
      return "success";
    })
  };
});

describe("Error Handling", () => {
  const clientSecret = "success";
  const dummyToken = "fakeToken";

  test(
    "should throw error if it cannot retrieve authentication token",
    suppressWinstonLogs(async () => {
      const customError = "YIKES";
      nock("https://noipm-ci.auth0.com", {
        reqheaders: {
          "content-type": "application/json"
        }
      })
        .post("/oauth/token", {
          grant_type: "client_credentials",
          client_id: "FAKEDATA01010101",
          client_secret: clientSecret,
          audience: "https://noipm-ci.auth0.com/api/v2/"
        })
        .replyWithError({ message: customError, code: 500 });

      try {
        await userService.getUsers();
      } catch (e) {
        expect(e).toBeInstanceOf(Boom);
        expect(e.message).toMatch(
          INTERNAL_ERRORS.USER_MANAGEMENT_API_TOKEN_FAILURE
        );
      }
    })
  );

  test(
    "should throw error if it cannot retrieve user data",
    suppressWinstonLogs(async () => {
      nock("https://noipm-ci.auth0.com", {
        reqheaders: {
          "content-type": "application/json"
        }
      })
        .post("/oauth/token", {
          grant_type: "client_credentials",
          client_id: "FAKEDATA01010101",
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

      try {
        await userService.getUsers();
      } catch (e) {
        expect(e).toBeInstanceOf(Boom);
        expect(e.message).toMatch(
          INTERNAL_ERRORS.USER_MANAGEMENT_API_GET_USERS_FAILURE
        );
      }
    })
  );
});

describe("userService", () => {
  const test = authEnabledTest();
  let tokenCall, getUsersCall;
  const dummyToken = "fakeToken";
  const clientSecret = "success";

  const auth0Response = {
    email: "john.doe@thoughtworks.com",
    email_verified: true,
    updated_at: "2019-09-11T20:39:29.343Z",
    user_id: "auth0|5d3jhgfjhfggfdd87dsfsdf0ec234324",
    name: "john doe",
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

  beforeEach(async () => {
    tokenCall = nock("https://noipm-ci.auth0.com", {
      reqheaders: {
        "content-type": "application/json"
      }
    })
      .post("/oauth/token", {
        grant_type: "client_credentials",
        client_id: "FAKEDATA01010101",
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
      .reply(200, [auth0Response]);
  });

  test(
    "should call auth0 token api to get bearer token and should call get_users endpoint from auth0 api",
    suppressWinstonLogs(async () => {
      const auth0Users = await userService.getUsers();

      expect(tokenCall.isDone()).toBeTrue();
      expect(getUsersCall.isDone()).toBeTrue();
      expect(auth0Users).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: auth0Response.email,
            name: auth0Response.name
          })
        ])
      );
    })
  );

  test(
    "should not call Auth0 for subsequent Calls",
    suppressWinstonLogs(async () => {
      const auth0Users = await userService.getUsers();

      expect(tokenCall.isDone()).not.toBeTrue();
      expect(getUsersCall.isDone()).not.toBeTrue();
      expect(auth0Users).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            email: auth0Response.email,
            name: auth0Response.name
          })
        ])
      );
    })
  );
});
