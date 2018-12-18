import getAccessToken from "../../../auth/getAccessToken";
import approveReferralLetter from "./approveReferralLetter";
import { push } from "react-router-redux";
import nock from "nock";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
import configureInterceptors from "../../../interceptors";

jest.mock("../../../auth/getAccessToken");

describe("approve referral letter", () => {
  let caseId, dispatch, mockCallback;

  beforeEach(() => {
    caseId = 1;
    dispatch = jest.fn();
    configureInterceptors({dispatch});
    mockCallback = jest.fn();
  });

  test("expect display success snackbar, redirect to cases page, and callback ran", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");

    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(`/api/cases/${caseId}/referral-letter/approve-letter`)
      .reply(200, {});
    await approveReferralLetter(caseId, mockCallback)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Status was successfully updated")
    );
    expect(mockCallback).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });

  test("dispatches failure on 500 error response", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");

    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(`/api/cases/${caseId}/referral-letter/approve-letter`)
      .reply(500);

    await approveReferralLetter(caseId, mockCallback)(dispatch);
    expect(mockCallback).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the case status was not updated. Please try again."
      )
    );
  });

  test("dispatches failure on 400 error response", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");

    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(`/api/cases/${caseId}/referral-letter/approve-letter`)
      .reply(400, { message: "Invalid case status" });

    await approveReferralLetter(caseId, mockCallback)(dispatch);
    expect(mockCallback).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError("Case status could not be updated due to invalid status")
    );
  });
});
