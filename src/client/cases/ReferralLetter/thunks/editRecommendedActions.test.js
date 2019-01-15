import getAccessToken from "../../../auth/getAccessToken";
import { push } from "react-router-redux";
import editRecommendedActions from "./editRecommendedActions";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
import nock from "nock";
import configureInterceptors from "../../../axiosInterceptors/interceptors";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

jest.mock("../../../auth/getAccessToken");

describe("editRecommendedActions", function() {
  let caseId, dispatch, requestBody;
  beforeEach(() => {
    caseId = 5;
    dispatch = jest.fn();
    configureInterceptors({ dispatch });
    requestBody = {
      id: 7,
      includeRetaliationConcerns: true,
      letterOfficers: [
        {
          id: 99,
          referralLetterOfficerRecommendedActions: [1, 3, 4],
          recommendedActionNotes: "recommend some action"
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
        `/api/cases/${caseId}/referral-letter/recommended-actions`,
        requestBody
      )
      .reply(200, {});

    await editRecommendedActions(caseId, requestBody, "redirectRoute")(
      dispatch
    );
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Recommended actions were successfully updated")
    );
    expect(dispatch).not.toHaveBeenCalledWith(push(`/cases/${caseId}`));
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
        `/api/cases/${caseId}/referral-letter/recommended-actions`,
        requestBody
      )
      .reply(500);

    await editRecommendedActions(caseId, requestBody, "redirectRoute")(
      dispatch
    );
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and we could not update the recommended actions information"
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
        `/api/cases/${caseId}/referral-letter/recommended-actions`,
        requestBody
      )
      .reply(400, responseBody);

    await editRecommendedActions(caseId, requestBody, "redirectRoute")(
      dispatch
    );
    expect(dispatch).toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });

  test("routes to given redirect url on success", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");

    const responseBody = {
      id: 7,
      includeRetaliationConcerns: null,
      letterOfficers: []
    };
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(
        `/api/cases/${caseId}/referral-letter/recommended-actions`,
        requestBody
      )
      .reply(200, responseBody);

    await editRecommendedActions(caseId, requestBody, "redirectRoute")(
      dispatch
    );
    expect(dispatch).toHaveBeenCalledWith(push("redirectRoute"));
  });
});
