import removeCaseNote from "./removeCaseNote";
import nock from "nock";
import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import {
  closeRemoveCaseNoteDialog,
  removeCaseNoteFailure,
  removeCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";
import configureInterceptors from "../../axiosInterceptors/interceptors";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

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

    expect(dispatch).toHaveBeenCalledWith(removeCaseNoteSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(closeRemoveCaseNoteDialog());
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

    expect(dispatch).toHaveBeenCalledWith(removeCaseNoteFailure());
  });

  test("should redirect immediately if token missing", async () => {
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
