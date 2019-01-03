import getAccessToken from "../../../auth/getAccessToken";
import nock from "nock";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import getReferralLetterData from "./getReferralLetterData";
import { getReferralLetterSuccess } from "../../../actionCreators/letterActionCreators";
import { getMinimumCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import invalidCaseStatusRedirect from "../../thunks/invalidCaseStatusRedirect";

jest.mock("../../../auth/getAccessToken");
jest.mock("../../thunks/invalidCaseStatusRedirect", () => caseId => ({
  type: "InvalidCaseStatusRedirect",
  caseId
}));

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

    const minimumCaseDetailsResponse = [
      { caseNumber: "CC2017-0005", status: "status" }
    ];

    nock("http://localhost", {})
      .get(`/api/cases/${caseId}/minimum-case-details`)
      .reply(200, minimumCaseDetailsResponse);

    await getReferralLetterData(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getReferralLetterSuccess(responseBody)
    );

    expect(dispatch).toHaveBeenCalledWith(
      getMinimumCaseDetailsSuccess(minimumCaseDetailsResponse)
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
    expect(dispatch).toHaveBeenCalledWith(invalidCaseStatusRedirect(caseId));
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

    const minimumCaseDetailsResponse = [
      { caseNumber: "CC2017-0005", status: "test-status" }
    ];

    nock("http://localhost", {})
      .get(`/api/cases/${caseId}/minimum-case-details`)
      .reply(200, minimumCaseDetailsResponse);

    await getReferralLetterData(caseId)(dispatch);
    expect(dispatch).not.toHaveBeenCalledWith(
      invalidCaseStatusRedirect(caseId)
    );
    expect(dispatch).toHaveBeenCalledWith(
      getReferralLetterSuccess(responseBody)
    );
  });
});
