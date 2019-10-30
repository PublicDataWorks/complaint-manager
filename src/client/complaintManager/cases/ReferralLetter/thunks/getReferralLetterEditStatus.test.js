import configureInterceptors from "../../../../common/axiosInterceptors/interceptors";
import nock from "nock";
import { getReferralLetterEditStatusSuccess } from "../../../actionCreators/letterActionCreators";
import getReferralLetterEditStatus from "./getReferralLetterEditStatus";

jest.mock("../../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("getReferralLetterEditStatus", () => {
  let dispatch = jest.fn();
  let caseId;
  const ReferralLetterEditStatusResponseBody = {
    editStatus: "letter type value"
  };

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch = jest.fn();
    caseId = 5;
  });

  test("dispatches success with response", async () => {
    nock("http://localhost")
      .get(`/api/cases/${caseId}/referral-letter/edit-status`)
      .reply(200, ReferralLetterEditStatusResponseBody);

    await getReferralLetterEditStatus(caseId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      getReferralLetterEditStatusSuccess(
        ReferralLetterEditStatusResponseBody.editStatus
      )
    );
  });
});
