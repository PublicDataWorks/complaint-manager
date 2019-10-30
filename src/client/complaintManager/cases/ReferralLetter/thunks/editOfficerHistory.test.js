import getAccessToken from "../../../../common/auth/getAccessToken";
import nock from "nock";
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";
import configureInterceptors from "../../../../common/axiosInterceptors/interceptors";
import { push } from "connected-react-router";
import editOfficerHistory from "./editOfficerHistory";

jest.mock("../../../../common/auth/getAccessToken");

describe("editReferralLetter", () => {
  let caseId, dispatch, requestBody;
  beforeEach(() => {
    caseId = 5;
    dispatch = jest.fn();
    configureInterceptors({ dispatch });
    requestBody = {
      letterOfficers: [
        {
          caseOfficerId: 99,
          fullName: "Elenor Wrell",
          numHistoricalHighAllegations: 2,
          numHistoricalMedAllegations: 3,
          numHistoricalLowAllegations: 4,
          historicalBehaviorNotes: "<p>notes here</p>",
          referralLetterOfficerHistoryNotes: []
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
      .put(`/api/cases/${caseId}/referral-letter/officer-history`, requestBody)
      .reply(200, {});

    await editOfficerHistory(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Officer complaint history was successfully updated")
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
      .put(`/api/cases/${caseId}/referral-letter/officer-history`, requestBody)
      .reply(200, {});

    await editOfficerHistory(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push("redirectRoute"));
  });
});
