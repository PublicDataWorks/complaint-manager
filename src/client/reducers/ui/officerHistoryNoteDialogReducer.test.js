import officerHistoryNoteDialogReducer from "./officerHistoryNoteDialogReducer";
import {
  closeRemoveOfficerHistoryNoteDialog,
  openRemoveOfficerHistoryNoteDialog
} from "../../actionCreators/letterActionCreators";

describe("officerHistoryNoteDialogReducer", () => {
  test("initial state is closed with empty fields and index", () => {
    const expectedState = {
      dialogOpen: false,
      fieldArrayName: undefined,
      noteIndex: undefined
    };
    const newState = officerHistoryNoteDialogReducer(undefined, {
      type: "SOMETHING"
    });
    expect(newState).toEqual(expectedState);
  });

  test("it sets open to true, fieldArrayName, and noteIndex when dialog opened", () => {
    const fieldArrayName = "fieldArrayName";
    const noteIndex = 5;
    const expectedState = { dialogOpen: true, fieldArrayName, noteIndex };
    const newState = officerHistoryNoteDialogReducer(
      undefined,
      openRemoveOfficerHistoryNoteDialog(fieldArrayName, noteIndex)
    );
    expect(newState).toEqual(expectedState);
  });

  test("it sets open to false, clears out fieldArrayName and noteIndex when dialog closed", () => {
    const fieldArrayName = undefined;
    const noteIndex = undefined;
    const expectedState = { dialogOpen: false, fieldArrayName, noteIndex };
    const newState = officerHistoryNoteDialogReducer(
      { dialogOpen: true, noteIndex: 5, fieldArrayName: "fields" },
      closeRemoveOfficerHistoryNoteDialog()
    );
    expect(newState).toEqual(expectedState);
  });
});
