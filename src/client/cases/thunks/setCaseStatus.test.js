import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import setCaseStatus from "./setCaseStatus";
import nock from "nock";
import { CASE_STATUS } from "../../../sharedUtilities/constants";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";
import {
  closeCaseStatusUpdateDialog,
  updateCaseStatusSuccess
} from "../../actionCreators/casesActionCreators";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("setCaseStatus", () => {
  const dispatch = jest.fn();
  beforeEach(() => {
    dispatch.mockClear();
  });

  test("should redirect to login when token missing", async () => {
    getAccessToken.mockImplementationOnce(() => false);

    await setCaseStatus()(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
  });

  test("should dispatch snackbar failure when non-200 code", async () => {
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: "Bearer TEST_TOKEN"
      }
    })
      .put("/api/cases/4/status")
      .reply(500);

    await setCaseStatus(4, "status")(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the case status was not updated. Please try again."
      )
    );
  });

  test("should reply a 200, dispatch a snackbar success message, and close the dialog on success", async () => {
    const updateDetails = {
      id: 1,
      status: CASE_STATUS.ACTIVE
    };
    const responseBody = { id: 1 };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: "Bearer TEST_TOKEN"
      }
    })
      .put(`/api/cases/${updateDetails.id}/status`, {
        status: updateDetails.status
      })
      .reply(200, responseBody);

    await setCaseStatus(updateDetails.id, updateDetails.status)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      updateCaseStatusSuccess(responseBody)
    );
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Status was successfully updated")
    );
    expect(dispatch).toHaveBeenCalledWith(closeCaseStatusUpdateDialog());
  });

  test("should redirect to redirect url on success if given", async () => {
    const updateDetails = {
      id: 1,
      status: CASE_STATUS.ACTIVE
    };
    const responseBody = { id: 1 };
    const redirectUrl = "url";

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: "Bearer TEST_TOKEN"
      }
    })
      .put(`/api/cases/${updateDetails.id}/status`, {
        status: updateDetails.status
      })
      .reply(200, responseBody);

    await setCaseStatus(updateDetails.id, updateDetails.status, redirectUrl)(
      dispatch
    );
    expect(dispatch).toHaveBeenCalledWith(push(redirectUrl));
  });
});
