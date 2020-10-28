import getWorkingCases from "../../policeDataManager/cases/thunks/getWorkingCases";
import nock from "nock";
import configureInterceptors from "./interceptors";
import { snackbarError } from "../../policeDataManager/actionCreators/snackBarActionCreators";

jest.mock("../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("ensureOnlineOnRequestInterceptor", () => {
  const dispatch = jest.fn();
  const sortBy = "sortBy";
  const sortDirection = "sortDirection";

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should dispatch snackbar error on loss of connection", async () => {
    nock("http://localhost").get(
      `/api/cases?sortBy=${sortBy}&sortDirection=${sortDirection}`
    );

    await getWorkingCases(sortBy, sortDirection)(dispatch);

    window.dispatchEvent(new Event("offline"));
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError("No Internet Connection")
    );
  });
});
