import caseNoteDialogReducer from "./caseNoteDialogReducer";
import {
  closeCaseNoteDialog,
  openCaseNoteDialog
} from "../../actionCreators/casesActionCreators";

describe("caseNoteDialogReducer", () => {
  test("should set up initial state", () => {
    const newState = caseNoteDialogReducer(undefined, {
      type: "some_action"
    });
    expect(newState).toEqual({
      open: false,
      dialogType: "Add",
      initialCaseNote: {}
    });
  });

  test("should set open to true and set the edit dialog state on openDialog", () => {
    const oldState = {
      open: false,
      dialogType: "none",
      initialCaseNote: {}
    };

    const dialogType = "Edit";
    const initialCaseNote = { some: "case note object" };

    const actualState = caseNoteDialogReducer(
      oldState,
      openCaseNoteDialog(dialogType, initialCaseNote)
    );

    const expectedState = {
      open: true,
      dialogType,
      initialCaseNote: initialCaseNote
    };

    expect(actualState).toEqual(expectedState);
  });

  test("should set open to false on closeDialog", () => {
    const newState = caseNoteDialogReducer(
      { open: true, some: "old state" },
      closeCaseNoteDialog()
    );

    expect(newState).toEqual({ open: false, some: "old state" });
  });
});
