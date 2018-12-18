import getAccessToken from "../../auth/getAccessToken";
import nock from "nock";
import { push } from "react-router-redux";
import addCaseNote from "./addCaseNote";
import {
  addCaseNoteFailure,
  addCaseNoteSuccess,
  closeCaseNoteDialog
} from "../../actionCreators/casesActionCreators";
import configureInterceptors from "../../interceptors";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("addCaseNote", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    configureInterceptors({dispatch});
    dispatch.mockClear();
  });

  test("should dispatch failure when add case note fails", async () => {
    const caseNote = {
      caseId: 12,
      action: "Miscellaneous"
    };

    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post(`/api/cases/${caseNote.caseId}/case-notes`, caseNote)
      .reply(500);

    await addCaseNote(caseNote)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(addCaseNoteFailure());
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
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post(`/api/cases/${caseNote.caseId}/case-notes`, caseNote)
      .reply(201, responseBody);

    await addCaseNote(caseNote)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      addCaseNoteSuccess(responseBody.caseDetails, responseBody.caseNotes)
    );
    expect(dispatch).toHaveBeenCalledWith(closeCaseNoteDialog());
  });
});
