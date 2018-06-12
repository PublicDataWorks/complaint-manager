import userActionDialogReducer from "./userActionDialogReducer";
import {
  closeUserActionDialog,
  openUserActionDialog
} from "../../actionCreators/casesActionCreators";

describe("userActionDialogReducer", () => {
  test("should set up initial state", () => {
    const newState = userActionDialogReducer(undefined, {
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

    const actualState = userActionDialogReducer(
      oldState,
      openUserActionDialog(dialogType, initialCaseNote)
    );

    const expectedState = {
      open: true,
      dialogType,
      initialCaseNote: initialCaseNote
    };

    expect(actualState).toEqual(expectedState);
  });

  test("should set open to false on closeDialog", () => {
    const newState = userActionDialogReducer(
      { open: true, some: "old state" },
      closeUserActionDialog()
    );

    expect(newState).toEqual({ open: false, some: "old state" });
  });
});
