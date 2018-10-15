import getAccessToken from "../../../auth/getAccessToken";
import nock from "nock";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
jest.mock("../../../auth/getAccessToken");
import { push } from "react-router-redux";
import editOfficerHistory from "./editOfficerHistory";
import { editReferralLetterSuccess } from "../../../actionCreators/letterActionCreators";

describe("editReferralLetter", () => {
  let caseId, dispatch, requestBody;
  beforeEach(() => {
    caseId = 5;
    dispatch = jest.fn();
    requestBody = {
      referralLetterOfficers: [
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

  test("redirects to login if no token", async () => {
    getAccessToken.mockImplementation(() => false);
    await editOfficerHistory(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });

  test("dispatches success with letter details on success", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");

    const responseBody = { id: 9, referralLetterOfficers: [] };
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(`/api/cases/${caseId}/referral-letter/officer-history`, requestBody)
      .reply(200, responseBody);

    await editOfficerHistory(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      editReferralLetterSuccess(responseBody)
    );
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Officer Complaint History was successfully updated")
    );
  });

  test("routes to given redirect url on success", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");

    const responseBody = { id: 9, referralLetterOfficers: [] };
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(`/api/cases/${caseId}/referral-letter/officer-history`, requestBody)
      .reply(200, responseBody);

    await editOfficerHistory(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push("redirectRoute"));
  });

  test("dispatches failure on error response", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(`/api/cases/${caseId}/referral-letter/officer-history`, requestBody)
      .reply(500);

    await editOfficerHistory(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and we could not update the referral letter information"
      )
    );
  });
});
