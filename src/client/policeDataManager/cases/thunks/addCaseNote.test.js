import nock from "nock";
import addCaseNote from "./addCaseNote";
import { addCaseNoteSuccess } from "../../actionCreators/casesActionCreators";
import configureInterceptors from "../../../common/axiosInterceptors/interceptors";
import { CASE_NOTE_FORM_NAME } from "../../../../sharedUtilities/constants";
import { startSubmit, stopSubmit } from "redux-form";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

jest.mock("../../../common/auth/getAccessToken", () =>
  jest.fn(() => "TEST_TOKEN")
);

describe("addCaseNote", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    configureInterceptors({ dispatch });
    dispatch.mockClear();
  });

  test("should dispatch start and stop submits when add case note fails", async () => {
    const caseNote = {
      caseId: 12,
      action: "Miscellaneous"
    };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json"
      }
    })
      .post(`/api/cases/${caseNote.caseId}/case-notes`, caseNote)
      .reply(500);

    await addCaseNote(caseNote)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(startSubmit(CASE_NOTE_FORM_NAME));
    expect(dispatch).toHaveBeenCalledWith(stopSubmit(CASE_NOTE_FORM_NAME));
  });

  test("should dispatch success when case note added successfully", async () => {
    const caseNote = {
      caseId: 12,
      action: "Miscellaneous"
    };

    const responseBody = {
      caseDetails: "deets",
      caseNotes: ["recent", "activity"]
    };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json"
      }
    })
      .post(`/api/cases/${caseNote.caseId}/case-notes`, caseNote)
      .reply(201, responseBody);

    await addCaseNote(caseNote)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(startSubmit(CASE_NOTE_FORM_NAME));
    expect(dispatch).toHaveBeenCalledWith(
      snackbarSuccess("Case note was successfully created")
    );
    expect(dispatch).toHaveBeenCalledWith(
      addCaseNoteSuccess(responseBody.caseDetails, responseBody.caseNotes)
    );
    expect(dispatch).toHaveBeenCalledWith(stopSubmit(CASE_NOTE_FORM_NAME));
  });
});
