const userService = require("./userService");
import { authEnabledTest } from "../testHelpers/authEnabledTest";
import okta from "@okta/okta-sdk-nodejs";

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
        engine: "okta",
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

jest.mock("@okta/okta-sdk-nodejs", () => {
  return {
    Client: jest.fn()
  };
});

describe("Error Handling", () => {
  const test = authEnabledTest();
  test("should throw error if it cannot retrieve user data", async () => {
    okta.Client.mockImplementation(() => ({
      userApi: {
        listUsers: jest.fn(async () => {
          throw new Error("oh nooooo");
        })
      }
    }));
    try {
      console.log(await userService.getUsers());
      expect(true).toBeFalse();
    } catch (error) {
      expect(error.message).toEqual("oh nooooo");
    }
  });
});

describe("userService", () => {
  const test = authEnabledTest();
  const USERS = [
    { email: "anna.banana@gmail.com", firstName: "Anna", lastName: "Banana" },
    { email: "bear@gmail.com", firstName: "Bear", lastName: "Boo" },
    { email: "d.lizard@gmail.com", firstName: "D", lastName: "Lizard" }
  ];
  let listUsers;

  beforeEach(async () => {
    listUsers = jest.fn(async () => {
      return {
        each: async callback => {
          USERS.forEach(user => {
            callback({ profile: user });
          });
        }
      };
    });
    okta.Client.mockImplementation(() => ({
      userApi: {
        listUsers
      }
    }));
  });

  test("should call get_users endpoint from okta api", async () => {
    expect(await userService.getUsers()).toEqual(
      USERS.map(user => ({
        email: user.email,
        name: user.firstName + " " + user.lastName
      }))
    );
  });

  test("should not call okta for subsequent Calls", async () => {
    expect(await userService.getUsers()).toEqual(
      USERS.map(user => ({
        email: user.email,
        name: user.firstName + " " + user.lastName
      }))
    );
    expect(listUsers).not.toHaveBeenCalled();
  });
});
