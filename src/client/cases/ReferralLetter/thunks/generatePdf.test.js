import saveAs from "file-saver";
import generatePdf from "./generatePdf";
import nock from "nock";
import getAccessToken from "../../../auth/getAccessToken";
import { push } from "react-router-redux";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";

jest.mock("file-saver", () => jest.fn());
jest.mock("../../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("generatePdf thunk", function() {
  const dispatch = jest.fn();
  const caseId = 2;
  const token = "token";
  let edited;
  const uneditedFileName = `${caseId} - Generated Preview Letter.pdf`;
  const editedFileName = `${caseId} - Edited Preview Letter.pdf`;

  beforeEach(() => {
    edited = false;
  });

  test("redirects to login if no token", async () => {
    getAccessToken.mockImplementation(() => null);
    await generatePdf(caseId, edited)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(push("/login"));
  });

  test("should call saveAs when downloading letter pdf", async () => {
    getAccessToken.mockImplementation(() => token);
    const response = "some response";
    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer ${token}`
      }
    })
      .get(`/api/cases/${caseId}/referral-letter/generate-pdf`)
      .reply(200, response);

    await generatePdf(caseId, edited)(dispatch);
    const expectFile = new File([response], uneditedFileName);

    expect(saveAs).toHaveBeenCalledWith(expectFile, uneditedFileName);
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
      .get(`/api/cases/${caseId}/referral-letter/generate-pdf`)
      .reply(200, response);

    await generatePdf(caseId, edited)(dispatch);
    const expectFile = new File([response], editedFileName);

    expect(saveAs).toHaveBeenCalledWith(expectFile, editedFileName);
  });

  test("dispatches snackbar error when 500 response code", async () => {
    getAccessToken.mockImplementation(() => token);
    nock("http://localhost", {
      reqheaders: {
        Authorization: `Bearer ${token}`
      }
    })
      .get(`/api/cases/${caseId}/referral-letter/generate-pdf`)
      .reply(500);

    await generatePdf(caseId, edited)(dispatch);
    expect(dispatch).toHaveBeenCalledWith(
      snackbarError(
        "Something went wrong and the letter was not downloaded. Please try again."
      )
    );
  });
});
