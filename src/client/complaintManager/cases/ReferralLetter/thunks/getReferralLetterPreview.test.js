import getAccessToken from "../../../../common/auth/getAccessToken";
import { push } from "connected-react-router";
import getReferralLetterPreview from "./getReferralLetterPreview";
import nock from "nock";
import { getReferralLetterPreviewSuccess } from "../../../actionCreators/letterActionCreators";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { EDIT_STATUS } from "../../../../../sharedUtilities/constants";
import configureInterceptors from "../../../../common/axiosInterceptors/interceptors";

jest.mock("../../../../common/auth/getAccessToken");
jest.mock("../../thunks/invalidCaseStatusRedirect", () => caseId => ({
  type: "something",
  caseId
}));

describe("getReferralLetterPreview", function() {
  let caseId, dispatch;
  beforeEach(() => {
    caseId = 7;
    dispatch = jest.fn();
    configureInterceptors({ dispatch });
  });

  test("dispatches getReferralLetterPreviewSuccess and getCaseDetailsSuccess with data, doesn't redirect to case details page", async () => {
    getAccessToken.mockImplementation(() => "TOKEN");
    const responseBody = {
      letterHtml: "html string",
      addresses: {
        recipient: "recipient",
        recipientAddress: "recipient address"
      },
      caseDetails: { status: "Letter in Progress", id: 5 },
      editStatus: EDIT_STATUS.GENERATED,
      lastEdited: null,
      finalFilename: "some file name",
      draftFilename: "some draft name"
    };
    nock("http://localhost", {})
      .get(`/api/cases/${caseId}/referral-letter/preview`)
      .reply(200, responseBody);
    await getReferralLetterPreview(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getReferralLetterPreviewSuccess(
        responseBody.letterHtml,
        responseBody.addresses,
        responseBody.editStatus,
        responseBody.lastEdited,
        responseBody.finalFilename,
        responseBody.draftFilename
      )
    );
    expect(dispatch).toHaveBeenCalledWith(
      getCaseDetailsSuccess(responseBody.caseDetails)
    );
    expect(dispatch).not.toHaveBeenCalledWith(push(`/cases/${caseId}`));
  });
});
