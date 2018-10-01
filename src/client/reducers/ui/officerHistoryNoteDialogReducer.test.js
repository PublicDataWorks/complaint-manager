import officerHistoryNoteDialogReducer from "./officerHistoryNoteDialogReducer";
import {
  closeRemoveOfficerHistoryNoteDialog,
  openRemoveOfficerHistoryNoteDialog
} from "../../actionCreators/letterActionCreators";

describe("officerHistoryNoteDialogReducer", () => {
  test("initial state is closed with empty fieldArrayName, noteIndex and noteDetails", () => {
    const expectedState = {
      dialogOpen: false,
      fieldArrayName: undefined,
      noteIndex: undefined,
      noteDetails: {}
    };
    const newState = officerHistoryNoteDialogReducer(undefined, {
      type: "SOMETHING"
    });
    expect(newState).toEqual(expectedState);
  });

  test("it sets open to true, fieldArrayName, noteIndex, and noteDetails when dialog opened", () => {
    const fieldArrayName = "fieldArrayName";
    const noteIndex = 5;
    const noteDetails = { some: "details" };
    const expectedState = {
      dialogOpen: true,
      fieldArrayName,
      noteIndex,
      noteDetails
    };
    const newState = officerHistoryNoteDialogReducer(
      undefined,
      openRemoveOfficerHistoryNoteDialog(fieldArrayName, noteIndex, noteDetails)
    );
    expect(newState).toEqual(expectedState);
  });

  test("it sets open to false, clears out fieldArrayName, noteIndex and noteDetails when dialog closed", () => {
    const fieldArrayName = undefined;
    const noteIndex = undefined;
    const noteDetails = {};
    const expectedState = {
      dialogOpen: false,
      fieldArrayName,
      noteIndex,
      noteDetails
    };
    const newState = officerHistoryNoteDialogReducer(
      {
        dialogOpen: true,
        noteIndex: 5,
        fieldArrayName: "fields",
        noteDetails: { some: "details" }
      },
      closeRemoveOfficerHistoryNoteDialog()
    );
    expect(newState).toEqual(expectedState);
  });
});
