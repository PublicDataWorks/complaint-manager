import getAccessToken from "../../auth/getAccessToken";
import nock from "nock";
import { push } from "react-router-redux";
import addCaseNote from "./addCaseNote";
import {
  addCaseNoteFailure,
  addCaseNoteSuccess,
  closeCaseNoteDialog
} from "../../actionCreators/casesActionCreators";
import { duration } from "@material-ui/core/styles/transitions";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));
const resolve = jest.fn();
jest.useFakeTimers();

describe("addCaseNote", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    dispatch.mockClear();
    jest.clearAllTimers();
    resolve.mockClear();
  });
  afterAll(() => {
    jest.clearAllTimers();
  });

  test("should redirect immediately if token missing", async () => {
    getAccessToken.mockImplementationOnce(() => false);
    await addCaseNote()(dispatch);

    expect(dispatch).toHaveBeenCalledWith(push(`/login`));
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

    await addCaseNote(caseNote, resolve)(dispatch);

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

    await addCaseNote(caseNote, resolve)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      addCaseNoteSuccess(responseBody.caseDetails, responseBody.caseNotes)
    );
    expect(dispatch).toHaveBeenCalledWith(closeCaseNoteDialog());
  });

  test("should call resolve after screen transition duration", async () => {
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

    await addCaseNote(caseNote, resolve)(dispatch);

    expect(dispatch).toHaveBeenCalledWith(
      addCaseNoteSuccess(responseBody.caseDetails, responseBody.caseNotes)
    );
    expect(dispatch).toHaveBeenCalledWith(closeCaseNoteDialog());
    expect(resolve).not.toHaveBeenCalledTimes(1);
    jest.advanceTimersByTime(duration.leavingScreen);
    expect(resolve).toHaveBeenCalledTimes(1);
  });
});
