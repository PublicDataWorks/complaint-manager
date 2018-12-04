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
import {
  CIVILIAN_INITIATED,
  LETTER_TYPE
} from "../../../../sharedUtilities/constants";

jest.mock("file-saver", () => jest.fn());
jest.mock("../../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("getPdf thunk", function() {
  const dispatch = jest.fn();
  const caseId = 2;
  const firstContactDate = "2012-12-12";
  const caseNumber = "CC2012-0002";
  const complainantLastName = "Buster";
  const caseDetail = {
    id: caseId,
    firstContactDate: firstContactDate,
    caseNumber: caseNumber,
    complainantCivilians: [{ lastName: complainantLastName }],
    complaintType: CIVILIAN_INITIATED
  };
  const formattedFirstContactDate = "12-12-2012";
  const token = "token";
  let letterType;
  const uneditedFileName = `${formattedFirstContactDate}_${caseNumber}_Generated_Referral_Draft_${complainantLastName}.pdf`;
  const editedFileName = `${formattedFirstContactDate}_${caseNumber}_Edited_Referral_Draft_${complainantLastName}.pdf`;

  beforeEach(() => {
    letterType = LETTER_TYPE.GENERATED;
    dispatch.mockClear();
  });

  test("redirects to login if no token", async () => {
    getAccessToken.mockImplementation(() => null);
    await getPdf(caseDetail, letterType)(dispatch);
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

      await getPdf(caseDetail, letterType, true)(dispatch);
      const expectFile = new File([response], uneditedFileName);

      expect(saveAs).toHaveBeenCalledWith(expectFile, uneditedFileName);
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

      await getPdf(caseDetail, letterType, true)(dispatch);
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

      await getPdf(caseDetail, letterType, true)(dispatch);
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
      await getPdf(caseDetail)(dispatch);
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

      await getPdf(caseDetail)(dispatch);
      expect(dispatch).toHaveBeenCalledWith(
        snackbarError(
          "Something went wrong and the letter was not downloaded. Please try again."
        )
      );
      expect(dispatch).toHaveBeenCalledWith(stopLetterDownload());
    });
  });
});
