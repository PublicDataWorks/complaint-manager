import nock from "nock";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import { getUsersSuccess } from "../../../complaintManager/actionCreators/shared/usersActionCreators";
import getUsers from "./getUsers";
import { snackbarError } from "../../../complaintManager/actionCreators/snackBarActionCreators";
import { INTERNAL_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

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

  test("should dispatch snackbar error when there is an error fetching users", async () => {
    nock("http://localhost")
      .get("/api/users")
      .replyWithError({
        message: "Oh no",
        code: "THE WORST ERROR"
      });

    await getUsers()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(INTERNAL_ERRORS.USER_MANAGEMENT_API_GET_USERS_FAILURE)
    );
  });
});
