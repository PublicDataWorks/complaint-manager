import getAccessToken from "../../../auth/getAccessToken";
import nock from "nock";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
jest.mock("../../../auth/getAccessToken");
import { push } from "react-router-redux";
import getReferralLetter from "./getReferralLetter";
import { getReferralLetterSuccess } from "../../../actionCreators/letterActionCreators";

describe("getReferralLetter", () => {
  let caseId, dispatch;
  beforeEach(() => {
    caseId = 5;
    dispatch = jest.fn();
  });

  test("redirects to login if no token", async () => {
    getAccessToken.mockImplementation(() => false);
    await getReferralLetter(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });

  test("dispatches success with letter details on success", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");
    const responseBody = {
      id: 9,
      letterOfficers: []
    };
    nock("http://localhost", {})
      .get(`/api/cases/${caseId}/referral-letter`)
      .reply(200, responseBody);

    await getReferralLetter(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getReferralLetterSuccess(responseBody)
    );
  });

  test("dispatches failure on error response", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");
    nock("http://localhost", {})
      .get(`/api/cases/${caseId}/referral-letter`)
      .reply(500);

    await getReferralLetter(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the page could not be loaded. Please try again."
      )
    );
  });

  test("redirects to case page if case is in invalid status for letter generation", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");
    const responseBody = {
      message: "Invalid case status"
    };
    nock("http://localhost", {})
      .get(`/api/cases/${caseId}/referral-letter`)
      .reply(400, responseBody);

    await getReferralLetter(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });

  test("does not redirect to case page if case is in a valid status for letter generation", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");
    const responseBody = {
      id: 9,
      letterOfficers: []
    };
    nock("http://localhost", {})
      .get(`/api/cases/${caseId}/referral-letter`)
      .reply(200, responseBody);

    await getReferralLetter(caseId)(dispatch);
    expect(dispatch).not.toHaveBeenCalledWith(push(`/cases/${caseId}`));
    expect(dispatch).toHaveBeenCalledWith(
      getReferralLetterSuccess(responseBody)
    );
  });
});
