import highlightCaseNoteReducer from "./highlightCaseNoteReducer";
import {
  clearHighlightedCaseNote,
  highlightCaseNote
} from "../../actionCreators/highlightCaseNoteActionCreators";
import { HIGHLIGHT_CASE_NOTE } from "../../../../sharedUtilities/constants";

describe("Highlight case note reducer", () => {
  test("should set up initial state", () => {
    const newState = highlightCaseNoteReducer(undefined, {
      type: "some_action"
    });

    expect(newState).toEqual({ caseNoteId: null });
  });

  test("should set caseNoteId to 8 on highlightCaseNote", () => {
    const oldState = { caseNoteId: null };

    const caseNoteId = 8;

    const actualState = highlightCaseNoteReducer(
      oldState,
      highlightCaseNote(caseNoteId)
    );

    const expectedState = {
      caseNoteId: caseNoteId
    };

    expect(actualState).toEqual(expectedState);
  });

  test("should set caseNoteId to null on clearHighlightedCaseNote", () => {
    const newState = highlightCaseNoteReducer(
      { caseNoteId: 8 },
      clearHighlightedCaseNote()
    );

    expect(newState).toEqual({ caseNoteId: null });
  });
});
