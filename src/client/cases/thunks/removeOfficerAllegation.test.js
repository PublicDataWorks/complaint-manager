import removeOfficerAllegation from "./removeOfficerAllegation";
import nock from "nock";
import { removeOfficerAllegationSuccess } from "../../actionCreators/allegationsActionCreators";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import configureInterceptors from "../../axiosInterceptors/interceptors";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("removeOfficerAllegation thunk", () => {
  let dispatch;
  const officerAllegationId = 15;
  beforeEach(() => {
    dispatch = jest.fn();
    configureInterceptors({ dispatch });
  });

  test("should dispatch success & snackbar success on 200 response", async () => {
    const response = { some: "successfully updated case details" };

    nock("http://localhost", {
      "Content-Type": "application/json",
      Authorization: `Bearer TEST_TOKEN`
    })
      .delete(`/api/officers-allegations/${officerAllegationId}`)
      .reply(200, response);

    await removeOfficerAllegation(officerAllegationId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      removeOfficerAllegationSuccess(response)
    );
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Allegation was successfully removed")
    );
  });
});
