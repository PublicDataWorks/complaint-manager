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

  test("redirects to login if no token", async () => {
    getAccessToken.mockImplementation(() => false);
    await editOfficerHistory(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });

  test("dispatches success with letter details on success, doesn't redirect to case details page", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");

    const responseBody = { id: 9, letterOfficers: [] };
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
      snackbarSuccess("Officer complaint history was successfully updated")
    );
    expect(dispatch).not.toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });

  test("routes to given redirect url on success", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");

    const responseBody = { id: 9, letterOfficers: [] };
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

  test("dispatches failure on 500 error response", async () => {
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
        "Something went wrong and the officer history was not updated. Please try again."
      )
    );
  });

  test("redirects to case details page if 400 error response (invalid letter generation case status)", async () => {
    const responseBody = {
      message: "Invalid case status."
    };
    getAccessToken.mockImplementation(() => "TEST_TOKEN");
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(`/api/cases/${caseId}/referral-letter/officer-history`, requestBody)
      .reply(400, responseBody);

    await editOfficerHistory(caseId, requestBody, "redirectRoute")(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });
});
