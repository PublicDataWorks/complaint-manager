import nock from "nock";
import configureInterceptors from "../../../axiosInterceptors/interceptors";
import { getUsersSuccess } from "../../../actionCreators/shared/usersActionCreators";
import getUsers from "./getUsers";

jest.mock("../../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("getUsers", () => {
  const dispatch = jest.fn();
  const responseBody = [
    {
      name: "Jacob",
      email: "jacob@me.com"
    },
    {
      name: "Kuba",
      email: "kuba@me.com"
    }
  ];

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should dispatch success when users are fetched", async () => {
    nock("http://localhost")
      .get("/api/users")
      .reply(200, responseBody);

    await getUsers()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(getUsersSuccess(responseBody));
  });
});
