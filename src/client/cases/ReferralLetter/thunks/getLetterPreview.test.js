import getAccessToken from "../../../auth/getAccessToken";
import { push } from "react-router-redux";
import getLetterPreview from "./getLetterPreview";
import nock from "nock";
import { getLetterPreviewSuccess } from "../../../actionCreators/letterActionCreators";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
jest.mock("../../../auth/getAccessToken");

describe("getLetterPreview", function() {
  let caseId, dispatch;
  beforeEach(() => {
    caseId = 7;
    dispatch = jest.fn();
  });

  test("redirects to login if invalid token", async () => {
    getAccessToken.mockImplementation(() => false);
    await getLetterPreview(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });

  test("dispatches getLetterPreviewSuccess with data", async () => {
    getAccessToken.mockImplementation(() => "TOKEN");
    const responseBody = "html string";
    nock("http://localhost", {})
      .get(`/api/cases/${caseId}/referral-letter/preview`)
      .reply(200, responseBody);
    await getLetterPreview(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      getLetterPreviewSuccess(responseBody)
    );
  });

  test("dispatches snackbar when there is an error", async () => {
    getAccessToken.mockImplementation(() => "TOKEN");
    const responseBody = "html string";
    nock("http://localhost", {})
      .get(`/api/cases/${caseId}/referral-letter/preview`)
      .reply(500, responseBody);
    await getLetterPreview(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the letter preview was not loaded. Please try again."
      )
    );
  });
});
