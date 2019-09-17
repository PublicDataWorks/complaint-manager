import nock from "nock";
import httpMocks from "node-mocks-http";
import getUsers from "./getUsers";

describe("getUsers tests", () => {
  const dummyToken = "fakeToken";

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
  });

  describe("Should retrieve users successfully", () => {
    let tokenCall, getUsersCall;

    beforeEach(() => {
      tokenCall = nock("https://noipm-ci.auth0.com", {
        reqheaders: {
          "content-type": "application/x-www-form-urlencoded"
        }
      })
        .post("/oauth/token", {
          form: {
            grant_type: "client_credentials",
            client_id: "po0KCHqu1sHYuVxNHE2DAioLfQghB9aP",
            audience: "https://noipm-ci.auth0.com/api/v2/"
          }
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
    test("should throw error if it cannot retrieve authentication token", async () => {
      nock("https://noipm-ci.auth0.com", {
        reqheaders: {
          "content-type": "application/x-www-form-urlencoded"
        }
      })
        .post("/oauth/token", {
          form: {
            grant_type: "client_credentials",
            client_id: "po0KCHqu1sHYuVxNHE2DAioLfQghB9aP",
            audience: "https://noipm-ci.auth0.com/api/v2/"
          }
        })
        .replyWithError("YIKES");
      await getUsers(mockGetUserRequest, mockGetUserResponse, next);

      expect(next).toHaveBeenCalledWith(
        new Error("Could not retrieve user management api token")
      );
    });

    test("should throw error if it cannot retrieve user data", async () => {
      nock("https://noipm-ci.auth0.com", {
        reqheaders: {
          "content-type": "application/x-www-form-urlencoded"
        }
      })
        .post("/oauth/token", {
          form: {
            grant_type: "client_credentials",
            client_id: "po0KCHqu1sHYuVxNHE2DAioLfQghB9aP",
            audience: "https://noipm-ci.auth0.com/api/v2/"
          }
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
        .replyWithError("OOF");
      await getUsers(mockGetUserRequest, mockGetUserResponse, next);

      expect(next).toHaveBeenCalledWith(
        new Error("Could not retrieve user data from authentication server")
      );
    });
  });
});
