import { push } from "react-router-redux";
import setCaseStatus from "./setCaseStatus";
import nock from "nock";
import {
  CASE_STATUS,
  UPDATE_CASE_STATUS_FORM_NAME,
  VALIDATION_ERROR_HEADER
} from "../../../sharedUtilities/constants";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";
import {
  closeCaseStatusUpdateDialog,
  openCaseValidationDialog,
  updateCaseStatusSuccess
} from "../../actionCreators/casesActionCreators";
import Boom from "boom";
import configureInterceptors from "../../axiosInterceptors/interceptors";
import { startSubmit, stopSubmit } from "redux-form";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("setCaseStatus", () => {
  const dispatch = jest.fn();
  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
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

    expect(dispatch).toHaveBeenCalledWith(startSubmit(UPDATE_CASE_STATUS_FORM_NAME));
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the case status was not updated. Please try again."
      )
    );
    expect(dispatch).toHaveBeenCalledWith(stopSubmit(UPDATE_CASE_STATUS_FORM_NAME));
  });

  test("should dispatch open validation error modal when validation errors exist and when 400 code", async () => {
    const mockCaseId = 1;
    const boomData = ["Incident Date is required"];
    let boomResponse = Boom.badRequest(VALIDATION_ERROR_HEADER);
    boomResponse.details = boomData;
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: "Bearer TEST_TOKEN"
      }
    })
      .put(`/api/cases/${mockCaseId}/status`)
      .reply(400, boomResponse);

    await setCaseStatus(mockCaseId, CASE_STATUS.LETTER_IN_PROGRESS)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(openCaseValidationDialog(boomData));
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

    expect(dispatch).toHaveBeenCalledWith(startSubmit(UPDATE_CASE_STATUS_FORM_NAME));
    expect(dispatch).toHaveBeenCalledWith(updateCaseStatusSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(snackbarSuccess("Status was successfully updated"));
    expect(dispatch).toHaveBeenCalledWith(closeCaseStatusUpdateDialog());
    expect(dispatch).toHaveBeenCalledWith(stopSubmit(UPDATE_CASE_STATUS_FORM_NAME));
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
