import getAccessToken from "../../../auth/getAccessToken";
import nock from "nock";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
import { push } from "react-router-redux";
import editIAProCorrections from "./editIAProCorrections";
import configureInterceptors from "../../../axiosInterceptors/interceptors";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

jest.mock("../../../auth/getAccessToken");

describe("editIAProCorrections", () => {
  let caseId, dispatch, requestBody;
  beforeEach(() => {
    caseId = 5;
    dispatch = jest.fn();
    configureInterceptors({ dispatch });
    requestBody = {
      referralLetterIAProCorrections: [
        {
          id: 99,
          details: "Please fix xxx in IAPro."
        }
      ]
    };
  });

  test("dispatches snackbar success on success, doesn't redirect to case details page", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(
        `/api/cases/${caseId}/referral-letter/iapro-corrections`,
        requestBody
      )
      .reply(200, {});

    await editIAProCorrections(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("IAPro corrections were successfully updated")
    );
    expect(dispatch).not.toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });

  test("routes to given redirect url on success", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(
        `/api/cases/${caseId}/referral-letter/iapro-corrections`,
        requestBody
      )
      .reply(200, {});

    await editIAProCorrections(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push("redirectRoute"));
  });

  test("dispatches failure on 500 error response", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(
        `/api/cases/${caseId}/referral-letter/iapro-corrections`,
        requestBody
      )
      .reply(500);

    await editIAProCorrections(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the IAPro corrections were not updated. Please try again."
      )
    );
  });

  test("redirects to case details page 400 error response (invalid letter generation case status)", async () => {
    const responseBody = {
      message: BAD_REQUEST_ERRORS.INVALID_CASE_STATUS
    };
    getAccessToken.mockImplementation(() => "TEST_TOKEN");
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(
        `/api/cases/${caseId}/referral-letter/iapro-corrections`,
        requestBody
      )
      .reply(400, responseBody);

    await editIAProCorrections(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });
});
