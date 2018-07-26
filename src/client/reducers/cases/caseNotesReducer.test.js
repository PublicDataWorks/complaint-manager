import caseNotesReducer from "./caseNotesReducer";
import {
  addCaseNoteSuccess,
  editCaseNoteSuccess,
  getCaseNotesSuccess,
  removeCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";

describe("caseNotesReducer", () => {
  test("should set default state", () => {
    const newState = caseNotesReducer(undefined, { type: "SOME_ACTION" });

    expect(newState).toEqual([]);
  });

  test("should return case notes array after successful get", () => {
    const expectedCaseNotes = ["action 1", "action 2"];
    const newState = caseNotesReducer(
      [],
      getCaseNotesSuccess(expectedCaseNotes)
    );

    expect(newState).toEqual(expectedCaseNotes);
  });

  test("should return case notes after case note logged", () => {
    const caseNotes = ["action 1", "action 2"];

    const newState = caseNotesReducer(
      [],
      addCaseNoteSuccess(undefined, caseNotes)
    );
    expect(newState).toEqual(caseNotes);
  });

  test("should replace case notes after removing case note", () => {
    const oldState = { some: "old state" };

    const caseNoteDetails = {
      details: {
        some: "new state"
      },
      caseNotes: {
        not: "copied over"
      }
    };

    const newState = caseNotesReducer(
      oldState,
      removeCaseNoteSuccess(caseNoteDetails)
    );

    expect(newState).toEqual(caseNoteDetails.caseNotes);
  });

  test("should replace case notes after editing case note", () => {
    const oldState = { some: "old state" };

    const caseNoteDetails = {
      some: "new state"
    };

    const newState = caseNotesReducer(
      oldState,
      editCaseNoteSuccess(caseNoteDetails)
    );

    expect(newState).toEqual(caseNoteDetails);
  });
});
