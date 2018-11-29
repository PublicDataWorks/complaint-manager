import saveAs from "file-saver";
import getPdf from "./getPdf";
import nock from "nock";
import getAccessToken from "../../../auth/getAccessToken";
import { push } from "react-router-redux";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import {
  getLetterPdfSuccess,
  stopLetterDownload
} from "../../../actionCreators/letterActionCreators";

jest.mock("file-saver", () => jest.fn());
jest.mock("../../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("getPdf thunk", function() {
  const dispatch = jest.fn();
  const caseId = 2;
  const token = "token";
  let edited;
  const uneditedFileName = `${caseId} - Generated Preview Letter.pdf`;
  const editedFileName = `${caseId} - Edited Preview Letter.pdf`;

  beforeEach(() => {
    edited = false;
    dispatch.mockClear();
  });

  test("redirects to login if no token", async () => {
    getAccessToken.mockImplementation(() => null);
    await getPdf(caseId, edited)(dispatch);
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

      await getPdf(caseId, edited, true)(dispatch);
      const expectFile = new File([response], uneditedFileName);

      expect(saveAs).toHaveBeenCalledWith(expectFile, uneditedFileName);
      expect(dispatch).toHaveBeenCalledWith(stopLetterDownload());
    });

    test("should call saveAs with edited filename when downloading edited letter pdf", async () => {
      getAccessToken.mockImplementation(() => token);
      const response = "some response";
      edited = true;
      nock("http://localhost", {
        reqheaders: {
          Authorization: `Bearer ${token}`
        }
      })
        .get(`/api/cases/${caseId}/referral-letter/get-pdf`)
        .reply(200, response);

      await getPdf(caseId, edited, true)(dispatch);
      const expectFile = new File([response], editedFileName);

      expect(saveAs).toHaveBeenCalledWith(expectFile, editedFileName);
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

      await getPdf(caseId, edited, true)(dispatch);
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
      await getPdf(caseId)(dispatch);
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

      await getPdf(caseId)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(
        snackbarError(
          "Something went wrong and the letter was not downloaded. Please try again."
        )
      );
      expect(dispatch).toHaveBeenCalledWith(stopLetterDownload());
    });
  });
});
