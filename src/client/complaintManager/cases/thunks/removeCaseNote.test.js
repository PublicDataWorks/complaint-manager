import removeCaseNote from "./removeCaseNote";
import nock from "nock";
import { startSubmit, stopSubmit } from "redux-form";
import { push } from "connected-react-router";
import getAccessToken from "../../../common/auth/getAccessToken";
import {
  closeRemoveCaseNoteDialog,
  removeCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import { REMOVE_CASE_NOTE_FORM_NAME } from "../../../../sharedUtilities/constants";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { authEnabledTest } from "../../../testHelpers";

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("removeCaseNote", () => {
  test("should dispatch success when case note removed successfully", async () => {
    const dispatch = jest.fn();
    configureInterceptors({ dispatch });

    const caseId = 1;
    const caseNoteId = 2;

    const responseBody = {
      caseDetails: {
        some: "case"
      }
    };

    nock("http://localhost")
      .delete(`/api/cases/${caseId}/case-notes/${caseNoteId}`)
      .reply(200, responseBody);

    await removeCaseNote(caseId, caseNoteId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      startSubmit(REMOVE_CASE_NOTE_FORM_NAME)
    );
    expect(dispatch).toHaveBeenCalledWith(removeCaseNoteSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Case note was successfully removed")
    );
    expect(dispatch).toHaveBeenCalledWith(closeRemoveCaseNoteDialog());
    expect(dispatch).toHaveBeenCalledWith(
      stopSubmit(REMOVE_CASE_NOTE_FORM_NAME)
    );
  });

  test("should dispatch failure when remove case note fails", async () => {
    const dispatch = jest.fn();
    configureInterceptors({ dispatch });

    const caseId = 1;
    const caseNoteId = 2;

    nock("http://localhost", {
      reqheaders: {
        Authorization: "Bearer TEST_TOKEN"
      }
    })
      .delete(`/api/cases/${caseId}/case-notes/${caseNoteId}`)
      .reply(500);

    await removeCaseNote(caseId, caseNoteId)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      startSubmit(REMOVE_CASE_NOTE_FORM_NAME)
    );
    expect(dispatch).toHaveBeenCalledWith(
      stopSubmit(REMOVE_CASE_NOTE_FORM_NAME)
    );
  });

  test("should redirect immediately if token missing", async () => {
    await authEnabledTest(async () => {
      const dispatch = jest.fn();
      configureInterceptors({ dispatch });

      const caseId = 1;
      const caseNoteId = 2;

      getAccessToken.mockImplementationOnce(() => false);

      nock("http://localhost", {
        reqheaders: {
          "Content-Type": "application/json",
          Authorization: "Bearer false"
        }
      })
        .delete(`/api/cases/${caseId}/case-notes/${caseNoteId}`)
        .reply(200);

      await removeCaseNote(caseId, caseNoteId)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(push(`/login`));
    });
  });
});
