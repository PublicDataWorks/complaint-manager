import saveAs from "file-saver";
import getPdf from "./getPdf";
import nock from "nock";
import getAccessToken from "../../../auth/getAccessToken";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import {
  getLetterPdfSuccess,
  stopLetterDownload
} from "../../../actionCreators/letterActionCreators";
import configureInterceptors from "../../../axiosInterceptors/interceptors";
import { LETTER_TYPE } from "../../../../sharedUtilities/constants";
import invalidCaseStatusRedirect from "../../thunks/invalidCaseStatusRedirect";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

jest.mock("file-saver", () => jest.fn());
jest.mock("../../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));
jest.mock("../../thunks/invalidCaseStatusRedirect", () => caseId => ({
  type: "InvalidCaseStatusRedirect",
  caseId
}));

describe("getPdf thunk", function() {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const caseId = 2;
  const token = "token";
  let letterType;
  const uneditedFilename =
    "12-12-2012_CC2012-0002_Generated_Referral_Draft_Buster.pdf";
  const editedFilename =
    "12-12-2012_CC2012-0002_Edited_Referral_Draft_Buster.pdf";
  const finalFilename = `${caseId}/12-12-2012_CC2012-0002_PIB_Referral_Buster.pdf`;
  const errorResponseFor500 = {
    statusCode: 500,
    error: "Internal Server Error",
    message: "Something went wrong"
  };
  const errorResponseFor400 = {
    statusCode: 400,
    error: "Bad Request",
    message: BAD_REQUEST_ERRORS.INVALID_CASE_STATUS
  };

  beforeEach(() => {
    letterType = LETTER_TYPE.GENERATED;
    dispatch.mockClear();
  });

  describe("saveFileForUser is true", () => {
    test("should call saveAs when downloading letter pdf", async () => {
      getAccessToken.mockImplementation(() => token);
      const response = "some response";
      nock("http://localhost", {
        reqheaders: {
          Authorization: `Bearer ${token}`
        }
      })
        .get(`/api/cases/${caseId}/referral-letter/get-pdf`)
        .reply(200, response);

      await getPdf(caseId, uneditedFilename, letterType, true)(dispatch);
      const expectFile = new File([response], uneditedFilename);

      expect(saveAs).toHaveBeenCalledWith(expectFile, uneditedFilename);
      expect(dispatch).toHaveBeenCalledWith(stopLetterDownload());
    });

    test("should call saveAs with edited filename when downloading edited letter pdf", async () => {
      getAccessToken.mockImplementation(() => token);
      const response = "some response";
      letterType = LETTER_TYPE.EDITED;
      nock("http://localhost", {
        reqheaders: {
          Authorization: `Bearer ${token}`
        }
      })
        .get(`/api/cases/${caseId}/referral-letter/get-pdf`)
        .reply(200, response);

      await getPdf(caseId, editedFilename, letterType, true)(dispatch);
      const expectFile = new File([response], editedFilename);

      expect(saveAs).toHaveBeenCalledWith(expectFile, editedFilename);
      expect(dispatch).toHaveBeenCalledWith(stopLetterDownload());
    });

    test("dispatches snackbar error when 500 response code", async () => {
      getAccessToken.mockImplementation(() => token);
      nock("http://localhost", {
        reqheaders: {
          Authorization: `Bearer ${token}`
        }
      })
        .get(`/api/cases/${caseId}/referral-letter/get-pdf`)
        .reply(500, errorResponseFor500);

      await getPdf(caseId, null, letterType, true)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(
        snackbarError(
          "Something went wrong and the letter was not downloaded. Please try again."
        )
      );
      expect(dispatch).toHaveBeenCalledWith(stopLetterDownload());
    });

    test("calls invalidCaseStatusRedirect when 400 response code with invalid status message", async () => {
      getAccessToken.mockImplementation(() => token);
      nock("http://localhost", {
        reqheaders: {
          Authorization: `Bearer ${token}`
        }
      })
        .get(`/api/cases/${caseId}/referral-letter/get-pdf`)
        .reply(400, errorResponseFor400);

      await getPdf(caseId, null, letterType, true)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(invalidCaseStatusRedirect(caseId));
      expect(dispatch).toHaveBeenCalledWith(stopLetterDownload());
    });
  });

  describe("saveFileForUser is false", () => {
    test("letterPdf is successfully dispatched and saveAs is not called", async () => {
      saveAs.mockClear();
      getAccessToken.mockImplementation(() => token);
      nock("http://localhost", {
        reqheaders: {
          Authorization: `Bearer ${token}`
        }
      })
        .get(`/api/cases/${caseId}/referral-letter/get-pdf`)
        .reply(200, "hello world");

      let arrayBuffer = new ArrayBuffer("hello world");
      await getPdf(caseId, finalFilename)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(getLetterPdfSuccess(arrayBuffer));
      expect(saveAs).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(stopLetterDownload());
    });

    test("dispatches snackbar error when 500 response code", async () => {
      getAccessToken.mockImplementation(() => token);
      nock("http://localhost", {
        reqheaders: {
          Authorization: `Bearer ${token}`
        }
      })
        .get(`/api/cases/${caseId}/referral-letter/get-pdf`)
        .reply(500, errorResponseFor500);

      await getPdf(caseId, null)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(
        snackbarError(
          "Something went wrong and the letter was not downloaded. Please try again."
        )
      );
      expect(dispatch).toHaveBeenCalledWith(stopLetterDownload());
    });
  });
});
