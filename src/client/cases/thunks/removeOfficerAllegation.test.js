import getAccessToken from "../../auth/getAccessToken";
import { push } from "connected-react-router";
import removeOfficerAllegation from "./removeOfficerAllegation";
import nock from "nock";
import {
  removeOfficerAllegationFailure,
  removeOfficerAllegationSuccess
} from "../../actionCreators/allegationsActionCreators";
import {
  snackbarSuccess,
  snackbarError
} from "../../actionCreators/snackBarActionCreators";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("removeOfficerAllegation thunk", () => {
  let dispatch;
  const officerAllegationId = 15;
  beforeEach(() => {
    dispatch = jest.fn();
  });

  test("should redirect to login when no token present", async () => {
    getAccessToken.mockImplementationOnce(() => false);

    await removeOfficerAllegation()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });

  test("should dispatch error and snackbar failure if 500 response", async () => {
    nock("http://localhost", {
      "Content-Type": "application/json",
      Authorization: `Bearer TEST_TOKEN`
    })
      .delete(`/api/officers-allegations/${officerAllegationId}`)
      .reply(500);

    await removeOfficerAllegation(officerAllegationId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(removeOfficerAllegationFailure());
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the allegation was not removed. Please try again."
      )
    );
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
