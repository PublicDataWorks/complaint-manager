import * as httpMocks from "node-mocks-http";
import verifyUserNickname from "./verifyUserNickname";

describe("verifyUserNickname", () => {
  let response, next;
  beforeEach(() => {
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("should throw error if nickname is missing from user info in the request", async () => {
    const request = httpMocks.createRequest({
      headers: {
        authorization: "Bearer VALID_TOKEN_FORMAT"
      }
    });

    await verifyUserNickname(request, response, next);
    expect(next).toHaveBeenCalledWith(new Error("User nickname missing"));
  });

  test("should attach nickname to request when it has been parsed into the user object from the token", async () => {
    const request = httpMocks.createRequest({
      headers: {
        authorization: "Bearer VALID_TOKEN_FORMAT"
      },
      user: {
        "https://noipm-ci.herokuapp.com/nickname": "mrsmith",
        iss: "https://noipm-dev.auth0.com/"
      }
    });

    await verifyUserNickname(request, response, jest.fn());
    expect(request.nickname).toEqual("mrsmith");
  });
});
