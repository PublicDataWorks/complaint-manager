import getAccessToken from "../../../auth/getAccessToken";
import nock from "nock";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import { push } from "react-router-redux";
import getReferralLetterData from "./getReferralLetterData";
import { getReferralLetterSuccess } from "../../../actionCreators/letterActionCreators";
import { getCaseNumberSuccess } from "../../../actionCreators/casesActionCreators";

jest.mock("../../../auth/getAccessToken");

describe("getReferralLetterData", () => {
  let caseId, dispatch;
  beforeEach(() => {
    caseId = 5;
    dispatch = jest.fn();
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

    const caseNumberResponse = [{ caseNumber: "CC2017-0005" }];

    nock("http://localhost", {})
      .get(`/api/cases/${caseId}/case-number`)
      .reply(200, caseNumberResponse);

    await getReferralLetterData(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getReferralLetterSuccess(responseBody)
    );

    expect(dispatch).toHaveBeenCalledWith(
      getCaseNumberSuccess(caseNumberResponse)
    );
  });

  test("dispatches failure on error response", async () => {
    getAccessToken.mockImplementation(() => "TEST_TOKEN");
    nock("http://localhost", {})
      .get(`/api/cases/${caseId}/referral-letter`)
      .reply(500);

    await getReferralLetterData(caseId)(dispatch);
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

    await getReferralLetterData(caseId)(dispatch);
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

    const caseNumberResponse = [{ caseNumber: "CC2017-0005" }];

    nock("http://localhost", {})
      .get(`/api/cases/${caseId}/case-number`)
      .reply(200, caseNumberResponse);

    await getReferralLetterData(caseId)(dispatch);
    expect(dispatch).not.toHaveBeenCalledWith(push(`/cases/${caseId}`));
    expect(dispatch).toHaveBeenCalledWith(
      getReferralLetterSuccess(responseBody)
    );
  });
});
