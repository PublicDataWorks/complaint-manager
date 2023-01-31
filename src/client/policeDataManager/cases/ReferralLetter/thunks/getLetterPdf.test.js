import saveAs from "file-saver";
import getLetterPdf from "./getLetterPdf";
import nock from "nock";
import getAccessToken from "../../../../common/auth/getAccessToken";
import {
  getReferralLetterPdfSuccess,
  stopLetterDownload
} from "../../../actionCreators/letterActionCreators";
import configureInterceptors from "../../../../common/axiosInterceptors/interceptors";
import { EDIT_STATUS } from "../../../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";
import { convertStringToArrayBuffer } from "../../../../testHelpers";

jest.mock("file-saver", () => jest.fn());
jest.mock("../../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);
jest.mock("../../thunks/invalidCaseStatusRedirect", () => caseId => ({
  type: "InvalidCaseStatusRedirect",
  caseId
}));

describe("getLetterPdf thunk", function () {
  const dispatch = jest.fn();
  configureInterceptors({ dispatch });
  const caseId = 2;
  const token = "token";
  let editStatus;
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
    editStatus = EDIT_STATUS.GENERATED;
    dispatch.mockClear();
  });

  describe("saveFileForUser is true", () => {
    test("should call saveAs when downloading letter pdf", async () => {
      getAccessToken.mockImplementation(() => token);
      const response = "some response";
      nock("http://localhost")
        .get(`/api/cases/${caseId}/referral-letter/get-pdf`)
        .reply(200, response);

      await getLetterPdf(caseId, uneditedFilename, true)(dispatch);
      const expectFile = new File([response], uneditedFilename);

      expect(saveAs).toHaveBeenCalledWith(expectFile, uneditedFilename);
      expect(dispatch).toHaveBeenCalledWith(stopLetterDownload());
    });

    test("should call saveAs with edited filename when downloading edited letter pdf", async () => {
      getAccessToken.mockImplementation(() => token);
      const response = "some response";
      editStatus = EDIT_STATUS.EDITED;
      nock("http://localhost")
        .get(`/api/cases/${caseId}/referral-letter/get-pdf`)
        .reply(200, response);

      await getLetterPdf(caseId, editedFilename, true)(dispatch);
      const expectFile = new File([response], editedFilename);

      expect(saveAs).toHaveBeenCalledWith(expectFile, editedFilename);
      expect(dispatch).toHaveBeenCalledWith(stopLetterDownload());
    });

    test("dispatches stopLetterDownload when 500 response code", async () => {
      getAccessToken.mockImplementation(() => token);
      nock("http://localhost")
        .get(`/api/cases/${caseId}/referral-letter/get-pdf`)
        .reply(500, errorResponseFor500);

      await getLetterPdf(caseId, null, true)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(stopLetterDownload());
    });

    test("dispatches stopLetterDownload when 400 response code with invalid status message", async () => {
      getAccessToken.mockImplementation(() => token);
      nock("http://localhost")
        .get(`/api/cases/${caseId}/referral-letter/get-pdf`)
        .reply(400, errorResponseFor400);

      await getLetterPdf(caseId, null, true)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(stopLetterDownload());
    });
  });

  describe("saveFileForUser is false", () => {
    test("letterPdf is successfully dispatched and saveAs is not called", async () => {
      saveAs.mockClear();
      getAccessToken.mockImplementation(() => token);
      nock("http://localhost")
        .get(`/api/cases/${caseId}/referral-letter/get-pdf`)
        .reply(200, "hello world");

      const arrayBuffer = convertStringToArrayBuffer("hello world");

      await getLetterPdf(caseId, finalFilename)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(
        getReferralLetterPdfSuccess(expect.objectContaining(arrayBuffer))
      );
      expect(saveAs).not.toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledWith(stopLetterDownload());
    });
  });
});
