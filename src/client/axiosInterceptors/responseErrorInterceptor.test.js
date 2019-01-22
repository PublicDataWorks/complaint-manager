import configureInterceptors from "./interceptors";
import nock from "nock";
import { push } from "connected-react-router";
import axios from "axios/index";
import {
  BAD_REQUEST_ERRORS,
  PAGE_NOT_AVAILABLE
} from "../../sharedUtilities/errorMessageConstants";
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
    test("redirects and shows snackbar error if redirect url exists", async () => {
      nock("http://localhost")
        .get(`/api/cases/${caseId}/referral-letter`)
        .reply(400, {
          message: PAGE_NOT_AVAILABLE,
          redirectUrl: `/cases/${caseId}`
        });

      await expect(
        axios.get(`/api/cases/${caseId}/referral-letter`)
      ).rejects.toBeTruthy();
      expect(dispatch).toHaveBeenCalledWith(snackbarError(PAGE_NOT_AVAILABLE));
      expect(dispatch).toHaveBeenCalledWith(push(`/cases/${caseId}`));
    });
    test("throws given error and does no additional action for case does not exist", async () => {
      nock("http://localhost")
        .get(`/api/cases/${caseId}`)
        .reply(400, {
          message: BAD_REQUEST_ERRORS.CASE_DOES_NOT_EXIST
        });

      await expect(axios.get(`/api/cases/${caseId}`)).rejects.toBeTruthy();
      expect(dispatch).toHaveBeenCalledWith(
        snackbarError(BAD_REQUEST_ERRORS.CASE_DOES_NOT_EXIST)
      );
      expect(dispatch).not.toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({ method: "push" })
        })
      );
    });

    test("converts array buffer to error", async () => {
      const errorResponseFor400 = {
        statusCode: 400,
        error: "Bad Request",
        message: PAGE_NOT_AVAILABLE,
        redirectUrl: `/cases/${caseId}`
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
      expect(dispatch).toHaveBeenCalledWith(snackbarError(PAGE_NOT_AVAILABLE));
    });

    test("dispatches snackbar error message when response is 500", async () => {
      const errorResponseFor500 = {
        statusCode: 500,
        error: "Internal Server Error",
        message: "500 error message"
      };

      nock("http://localhost", {
        reqheaders: {
          Authorization: `Bearer ${"token"}`
        }
      })
        .get(`/api/cases/${caseId}/referral-letter/get-pdf`)
        .reply(500, errorResponseFor500);

      await expect(
        axios.get(`/api/cases/${caseId}/referral-letter/get-pdf`)
      ).rejects.toBeTruthy();
      expect(dispatch).toHaveBeenCalledWith(snackbarError("500 error message"));
    });
  });
});
