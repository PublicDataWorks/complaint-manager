import configureInterceptors from "./interceptors";
import nock from "nock";
import { push } from "react-router-redux";
import axios from "axios/index";
import { BAD_REQUEST_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import { snackbarError } from "../actionCreators/snackBarActionCreators";
import { SNACKBAR_ERROR } from "../../sharedUtilities/constants";

jest.mock("../auth/getAccessToken", () => jest.fn(() => "token"));

describe("response error interceptor", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  describe("unauthorizedResponseInterceptor", () => {
    test("redirects to login on 401 response and still throw error for thunks", async () => {
      nock("http://localhost")
        .get("/api/something")
        .reply(401, { error: "Unauthorized" });

      try {
        await axios.get("/api/something");
      } catch (error) {
        expect(error.message).toEqual("Request failed with status code 401");
      }
      expect(dispatch).toHaveBeenCalledWith(push("/login"));
      expect(dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({ type: SNACKBAR_ERROR })
      );
    });

    test("does not redirect to login on 200 response", async () => {
      nock("http://localhost")
        .get("/api/something")
        .reply(200);

      await axios.get("http://localhost/api/something");

      expect(dispatch).not.toHaveBeenCalledWith(push("/login"));
    });
  });

  describe("bad request interceptor", () => {
    const caseId = 3;
    test("redirects to case details page and show snackbar error if in invalid status", async () => {
      nock("http://localhost")
        .get(`/api/cases/${caseId}/referral-letter`)
        .reply(400, { message: BAD_REQUEST_ERRORS.INVALID_CASE_STATUS });

      await expect(
        axios.get(`/api/cases/${caseId}/referral-letter`)
      ).rejects.toBeTruthy();
      expect(dispatch).toHaveBeenCalledWith(
        snackbarError("Sorry, that page is not available.")
      );
      expect(dispatch).toHaveBeenCalledWith(push(`/cases/${caseId}`));
    });

    test("redirects to case details page and show correct snackbar error if in invalid status for update", async () => {
      nock("http://localhost")
        .get(`/api/cases/${caseId}/referral-letter`)
        .reply(400, {
          message: BAD_REQUEST_ERRORS.INVALID_CASE_STATUS_FOR_UPDATE
        });

      await expect(
        axios.get(`/api/cases/${caseId}/referral-letter`)
      ).rejects.toBeTruthy();
      expect(dispatch).toHaveBeenCalledWith(
        snackbarError(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS_FOR_UPDATE)
      );
      expect(dispatch).toHaveBeenCalledWith(push(`/cases/${caseId}`));
    });

    test("converts array buffer to error", async () => {
      const errorResponseFor400 = {
        statusCode: 400,
        error: "Bad Request",
        message: BAD_REQUEST_ERRORS.INVALID_CASE_STATUS
      };

      nock("http://localhost", {
        reqheaders: {
          Authorization: `Bearer ${"token"}`
        }
      })
        .get(`/api/cases/${caseId}/referral-letter/get-pdf`)
        .reply(400, errorResponseFor400);

      await expect(
        axios.get(`/api/cases/${caseId}/referral-letter/get-pdf`, {
          responseType: "arraybuffer"
        })
      ).rejects.toBeTruthy();
      expect(dispatch).toHaveBeenCalledWith(push(`/cases/${caseId}`));
      expect(dispatch).toHaveBeenCalledWith(
        snackbarError("Sorry, that page is not available.")
      );
    });
  });
});
