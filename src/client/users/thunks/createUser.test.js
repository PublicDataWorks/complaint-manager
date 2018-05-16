import nock from "nock";
import createUser from "./createUser";
import {
  createUserFailure,
  createUserSuccess
} from "../../actionCreators/usersActionCreators";
import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("createUser", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    dispatch.mockClear();
  });

  test("should dispatch success when user created successfully", async () => {
    const user = {
      someUser: "some value"
    };
    const responseBody = {
      someResponse: "the response"
    };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post("/api/users", user)
      .reply(201, responseBody);

    await createUser(user)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(createUserSuccess(responseBody));
  });

  test("should dispatch failure when user not created successfully", async () => {
    const user = {
      someUser: "some value"
    };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post("/api/users", user)
      .reply(500);

    await createUser(user)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(createUserFailure());
  });

  test("should not dispatch success if unauthorized and should redirect", async () => {
    const user = { someUser: "some value" };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post("/api/users", user)
      .reply(401, user);

    await createUser(user)(dispatch);

    expect(dispatch).not.toHaveBeenCalledWith(createUserSuccess(user));
    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });

  test("should redirect immediately if token missing", async () => {
    getAccessToken.mockImplementation(() => false);

    const user = { someUser: "some value" };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post("/api/users", user)
      .reply(201, user);

    await createUser(user)(dispatch);

    expect(dispatch).not.toHaveBeenCalledWith(createUserSuccess(user));
    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });
});
