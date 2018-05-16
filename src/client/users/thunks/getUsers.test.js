import getUsers from "./getUsers";
import nock from "nock";
import { getUsersSuccess } from "../../actionCreators/usersActionCreators";
import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("getUsers thunk", () => {
  const dispatch = jest.fn();
  const responseBody = { users: ["some user"] };

  beforeEach(() => {
    getAccessToken.mockClear();
    dispatch.mockClear();
  });

  test("should call the API with token to get users", async () => {
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .get("/api/users")
      .reply(200, responseBody);

    await getUsers()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(getUsersSuccess(responseBody.users));
  });

  test("should not dispatch success and should redirect when 401 returned", async () => {
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .get("/api/users")
      .reply(401, responseBody);

    await getUsers()(dispatch);

    expect(dispatch).not.toHaveBeenCalledWith(
      getUsersSuccess(responseBody.users)
    );
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });

  test("should redirect immediately if token missing", async () => {
    getAccessToken.mockImplementation(() => false);

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer false`
      }
    })
      .get("/api/users")
      .reply(200, responseBody);

    await getUsers()(dispatch);

    expect(dispatch).not.toHaveBeenCalledWith(
      getUsersSuccess(responseBody.users)
    );
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });
});
