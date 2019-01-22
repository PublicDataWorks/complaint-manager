import getAccessToken from "../../../auth/getAccessToken";
import approveReferralLetter from "./approveReferralLetter";
import { push } from "react-router-redux";
import nock from "nock";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
import configureInterceptors from "../../../axiosInterceptors/interceptors";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

jest.mock("../../../auth/getAccessToken");

describe("approve referral letter", () => {
  let caseId, dispatch, mockCallback;

  beforeEach(() => {
    caseId = 1;
    dispatch = jest.fn();
    configureInterceptors({ dispatch });
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
});
