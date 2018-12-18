import saveAs from "file-saver";
import getPdf from "./getPdf";
import nock from "nock";
import getAccessToken from "../../../auth/getAccessToken";
import { push } from "connected-react-router";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import {
  getLetterPdfSuccess,
  stopLetterDownload
} from "../../../actionCreators/letterActionCreators";
import { LETTER_TYPE } from "../../../../sharedUtilities/constants";

jest.mock("file-saver", () => jest.fn());
jest.mock("../../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("getPdf thunk", function() {
  const dispatch = jest.fn();
  const caseId = 2;
  const token = "token";
  let letterType;
  const uneditedFilename =
    "12-12-2012_CC2012-0002_Generated_Referral_Draft_Buster.pdf";
  const editedFilename =
    "12-12-2012_CC2012-0002_Edited_Referral_Draft_Buster.pdf";
  const finalFilename = `${caseId}/12-12-2012_CC2012-0002_PIB_Referral_Buster.pdf`;

  beforeEach(() => {
    letterType = LETTER_TYPE.GENERATED;
    dispatch.mockClear();
  });

  test("redirects to login if no token", async () => {
    getAccessToken.mockImplementation(() => null);
    await getPdf(caseId, uneditedFilename, letterType)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
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
        .reply(500);

      await getPdf(caseId, null, letterType, true)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(
        snackbarError(
          "Something went wrong and the letter was not downloaded. Please try again."
        )
      );
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
        .reply(500);

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
