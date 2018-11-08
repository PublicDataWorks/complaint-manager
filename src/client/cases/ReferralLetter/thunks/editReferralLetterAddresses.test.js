import { push } from "react-router-redux";
import editReferralLetterAddresses from "./editReferralLetterAddresses";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
import nock from "nock";
import getAccessToken from "../../../auth/getAccessToken";
jest.mock("../../../auth/getAccessToken");

describe("editReferralLetterAddresses", () => {
  const redirectUrl = "url";
  const caseId = 9;
  const dispatch = jest.fn();
  const addressData = {
    recipient: "bob",
    sender: "jane",
    transcribedBy: "smith"
  };

  test("redirect to login if missing token", async () => {
    getAccessToken.mockImplementation(() => false);
    await editReferralLetterAddresses(caseId, addressData, redirectUrl)(
      dispatch
    );
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });

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
    const alternativeCallback = jest.fn();
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
      alternativeCallback
    )(dispatch);

    expect(alternativeCallback).toHaveBeenCalled();
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Letter was successfully updated")
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
