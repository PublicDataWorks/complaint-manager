import getAccessToken from "../../../auth/getAccessToken";
import getFinalPdfUrl from "./getFinalPdfUrl";
import nock from "nock";
import { getFinalPdfUrlSuccess } from "../../../actionCreators/letterActionCreators";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import configureInterceptors from "../../../interceptors";
jest.mock("../../../auth/getAccessToken");

describe("getFinalPdfUrl", () => {
  let dispatch, caseId;
  beforeEach(() => {
    dispatch = jest.fn();
    configureInterceptors({dispatch})
    caseId = 5;
  });

  test("retreives pdf url on success", async () => {
    getAccessToken.mockImplementation(() => "TOKEN");
    const responseBody = "test_url";
    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TOKEN`
      }
    })
      .get(`/api/cases/${caseId}/referral-letter/final-pdf-url`)
      .reply(200, responseBody);
    await getFinalPdfUrl(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(getFinalPdfUrlSuccess(responseBody));
  });

  test("shows error on failure", async () => {
    getAccessToken.mockImplementation(() => "TOKEN");
    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer TOKEN`
      }
    })
      .get(`/api/cases/${caseId}/referral-letter/final-pdf-url`)
      .reply(500);
    await getFinalPdfUrl(caseId)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the letter was not downloaded. Please try again."
      )
    );
  });
});
