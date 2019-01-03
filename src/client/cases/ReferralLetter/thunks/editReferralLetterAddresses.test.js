import { push } from "react-router-redux";
import editReferralLetterAddresses from "./editReferralLetterAddresses";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
import nock from "nock";
import getAccessToken from "../../../auth/getAccessToken";
import configureInterceptors from "../../../axiosInterceptors/interceptors";

jest.mock("../../../auth/getAccessToken");

describe("editReferralLetterAddresses", () => {
  const redirectUrl = "url";
  const caseId = 9;
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const addressData = {
    recipient: "bob",
    sender: "jane",
    transcribedBy: "smith"
  };

  test("redirects to redirect page and shows success on success", async () => {
    getAccessToken.mockImplementation(() => "token");
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer token`
      }
    })
      .put(`/api/cases/${caseId}/referral-letter/addresses`, addressData)
      .reply(200);
    await editReferralLetterAddresses(caseId, addressData, redirectUrl)(
      dispatch
    );

    expect(dispatch).toHaveBeenCalledWith(push(redirectUrl));
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Letter was successfully updated")
    );
  });

  test("calls alternative callback if given and shows success on success", async () => {
    getAccessToken.mockImplementation(() => "token");
    const alternativeSuccessCallback = jest.fn();
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer token`
      }
    })
      .put(`/api/cases/${caseId}/referral-letter/addresses`, addressData)
      .reply(200);
    await editReferralLetterAddresses(
      caseId,
      addressData,
      null,
      alternativeSuccessCallback
    )(dispatch);

    expect(alternativeSuccessCallback).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Letter was successfully updated")
    );
  });

  test("dispatches alternative error on error if given", async () => {
    getAccessToken.mockImplementation(() => "token");
    const alternativeSuccessCallback = jest.fn();
    const alternativeFailureCallback = jest.fn();
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer token`
      }
    })
      .put(`/api/cases/${caseId}/referral-letter/addresses`, addressData)
      .reply(500);
    await editReferralLetterAddresses(
      caseId,
      addressData,
      null,
      alternativeSuccessCallback,
      alternativeFailureCallback
    )(dispatch);
    expect(alternativeFailureCallback).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the letter was not updated. Please try again."
      )
    );
  });

  test("dispatches error if error", async () => {
    getAccessToken.mockImplementation(() => "token");
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer token`
      }
    })
      .put(`/api/cases/${caseId}/referral-letter/addresses`, addressData)
      .reply(500);
    await editReferralLetterAddresses(caseId, addressData, redirectUrl)(
      dispatch
    );

    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the letter was not updated. Please try again."
      )
    );
  });
});
