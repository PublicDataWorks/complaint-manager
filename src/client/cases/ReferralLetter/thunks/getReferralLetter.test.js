import getAccessToken from "../../../auth/getAccessToken";
import nock from "nock";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
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
    const responseBody = { id: 9, referralLetterOfficers: [] };
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
        "Something went wrong and we could not retrieve the referral letter information"
      )
    );
  });
});
