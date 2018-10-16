import getAccessToken from "../../../auth/getAccessToken";
import { push } from "react-router-redux";
import editRecommendedActions from "./editRecommendedActions";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
import nock from "nock";
import { editRecommendedActionsSuccess } from "../../../actionCreators/letterActionCreators";

jest.mock("../../../auth/getAccessToken");

describe("editRecommendedActions", function() {
  let caseId, dispatch, requestBody;
  beforeEach(() => {
    caseId = 5;
    dispatch = jest.fn();
    requestBody = {
      id: 7,
      includeRetaliationConcerns: true,
      referralLetterOfficers: [
        {
          id: 99,
          referralLetterOfficerRecommendedActions: [1, 3, 4],
          recommendedActionNotes: "recommend some action"
        }
      ]
    };
  });

  test("redirects to login if no token", async () => {
    getAccessToken.mockImplementation(() => false);
    await editRecommendedActions(caseId, requestBody, "redirectRoute")(
      dispatch
    );
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });

  test("dispatches success with recommended actions on success", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");

    const responseBody = {
      id: 7,
      includeRetaliationConcerns: true,
      referralLetterOfficers: [
        {
          id: 99,
          referralLetterOfficerRecommendedActions: [1, 3, 4],
          recommendedActionNotes: "This was saved"
        }
      ]
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
    expect(dispatch).toHaveBeenCalledWith(
      editRecommendedActionsSuccess(responseBody)
    );
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Recommended Actions were successfully updated")
    );
  });

  test("dispatches failure on error response", async () => {
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
        "Something went wrong and we could not update the Recommended Actions information"
      )
    );
  });

  test("routes to given redirect url on success", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");

    const responseBody = {
      id: 7,
      includeRetaliationConcerns: null,
      referralLetterOfficers: []
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
