import nock from "nock";
import editCaseNote from "./editCaseNote";
import {
  closeCaseNoteDialog,
  editCaseNoteFailure,
  editCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";
import configureInterceptors from "../../axiosInterceptors/interceptors";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("editCaseNote", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should dispatch failure when edit case note fails", async () => {
    const caseNote = {
      id: 1,
      caseId: 12,
      action: "Miscellaneous"
    };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(`/api/cases/${caseNote.caseId}/case-notes/${caseNote.id}`, caseNote)
      .reply(500);

    await editCaseNote(caseNote)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(editCaseNoteFailure());
  });

  test("should dispatch success when case note edited successfully", async () => {
    const caseNote = {
      id: 1,
      caseId: 12,
      action: "Miscellaneous"
    };

    const responseBody = [{ action: "Miscellaneous" }];

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .put(`/api/cases/${caseNote.caseId}/case-notes/${caseNote.id}`, caseNote)
      .reply(200, responseBody);

    await editCaseNote(caseNote)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(editCaseNoteSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(closeCaseNoteDialog());
  });
});
