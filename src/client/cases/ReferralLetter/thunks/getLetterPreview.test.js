import getAccessToken from "../../../auth/getAccessToken";
import { push } from "react-router-redux";
import getLetterPreview from "./getLetterPreview";
import nock from "nock";
import { getLetterPreviewSuccess } from "../../../actionCreators/letterActionCreators";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { LETTER_TYPE } from "../../../../sharedUtilities/constants";
import configureInterceptors from "../../../axiosInterceptors/interceptors";
import invalidCaseStatusRedirect from "../../thunks/invalidCaseStatusRedirect";

jest.mock("../../../auth/getAccessToken");
jest.mock("../../thunks/invalidCaseStatusRedirect", () => caseId => ({
  type: "something",
  caseId
}));

describe("getLetterPreview", function() {
  let caseId, dispatch;
  beforeEach(() => {
    caseId = 7;
    dispatch = jest.fn();
    configureInterceptors({ dispatch });
  });

  test("dispatches getLetterPreviewSuccess and getCaseDetailsSuccess with data, doesn't redirect to case details page", async () => {
    getAccessToken.mockImplementation(() => "TOKEN");
    const responseBody = {
      letterHtml: "html string",
      addresses: { recipient: "recipient" },
      caseDetails: { status: "Letter in Progress", id: 5 },
      letterType: LETTER_TYPE.GENERATED,
      lastEdited: null,
      finalFilename: "some file name",
      draftFilename: "some draft name"
    };
    nock("http://localhost", {})
      .get(`/api/cases/${caseId}/referral-letter/preview`)
      .reply(200, responseBody);
    await getLetterPreview(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getLetterPreviewSuccess(
        responseBody.letterHtml,
        responseBody.addresses,
        responseBody.letterType,
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

  test("dispatches snackbar when there is a 500 error", async () => {
    getAccessToken.mockImplementation(() => "TOKEN");
    nock("http://localhost", {})
      .get(`/api/cases/${caseId}/referral-letter/preview`)
      .reply(500);
    await getLetterPreview(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the letter preview was not loaded. Please try again."
      )
    );
  });

  test("redirects to case details page if 400 error response (invalid letter generation case status)", async () => {
    const responseBody = {
      message: "Invalid case status"
    };
    getAccessToken.mockImplementation(() => "TOKEN");
    nock("http://localhost", {})
      .get(`/api/cases/${caseId}/referral-letter/preview`)
      .reply(400, responseBody);
    await getLetterPreview(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(invalidCaseStatusRedirect(caseId));
  });
});
