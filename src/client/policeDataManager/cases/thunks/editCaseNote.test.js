import nock from "nock";
import editCaseNote from "./editCaseNote";
import { editCaseNoteSuccess } from "../../actionCreators/casesActionCreators";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import { startSubmit, stopSubmit } from "redux-form";
import { CASE_NOTE_FORM_NAME } from "../../../../sharedUtilities/constants";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("editCaseNote", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
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
        "Content-Type": "application/json"
      }
    })
      .put(`/api/cases/${caseNote.caseId}/case-notes/${caseNote.id}`, caseNote)
      .reply(200, responseBody);

    await editCaseNote(caseNote)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(startSubmit(CASE_NOTE_FORM_NAME));
    expect(dispatch).toHaveBeenCalledWith(editCaseNoteSuccess(responseBody));
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Case note was successfully updated")
    );
    expect(dispatch).toHaveBeenCalledWith(stopSubmit(CASE_NOTE_FORM_NAME));
  });
});
