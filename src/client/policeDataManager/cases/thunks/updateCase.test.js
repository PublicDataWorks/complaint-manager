import nock from "nock";
import updateCase from "./updateCase";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("updateCase", () => {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const updateDetails = {
    id: 1,
    assignedTo: "random.person@email.com"
  };

  beforeEach(() => {
    dispatch.mockClear();
  });

  test("should dispatch success when case updated successfully", async () => {
    const dispatch = jest.fn();

    const responseBody = {
      id: 1,
      assignedTo: "another.person@email.com"
    };

    nock("http://localhost")
      .put(`/api/cases/${updateDetails.id}`)
      .reply(200, responseBody);

    await updateCase(updateDetails)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Case was successfully updated")
    );
  });
});
