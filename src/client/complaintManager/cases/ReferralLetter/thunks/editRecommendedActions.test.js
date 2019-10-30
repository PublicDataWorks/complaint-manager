import getAccessToken from "../../../../common/auth/getAccessToken";
import { push } from "connected-react-router";
import editRecommendedActions from "./editRecommendedActions";
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";
import nock from "nock";
import configureInterceptors from "../../../../common/axiosInterceptors/interceptors";

jest.mock("../../../../common/auth/getAccessToken");

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
