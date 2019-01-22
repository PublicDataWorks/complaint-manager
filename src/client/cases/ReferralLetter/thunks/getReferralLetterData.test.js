import getAccessToken from "../../../auth/getAccessToken";
import nock from "nock";
import configureInterceptors from "../../../axiosInterceptors/interceptors";
import getReferralLetterData from "./getReferralLetterData";
import { getReferralLetterSuccess } from "../../../actionCreators/letterActionCreators";

jest.mock("../../../auth/getAccessToken");

describe("getReferralLetterData", () => {
  let caseId, dispatch;
  beforeEach(() => {
    caseId = 5;
    dispatch = jest.fn();
    configureInterceptors({ dispatch });
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

    await getReferralLetterData(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getReferralLetterSuccess(responseBody)
    );
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

    await getReferralLetterData(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getReferralLetterSuccess(responseBody)
    );
  });
});
