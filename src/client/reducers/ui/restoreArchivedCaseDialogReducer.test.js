import {
  closeRestoreArchivedCaseDialog,
  openRestoreArchivedCaseDialog
} from "../../actionCreators/casesActionCreators";
import restoreArchivedCaseDialogReducer from "./restoreArchivedCaseDialogReducer";

describe("restoreArchivedCaseDialogReducer", () => {
  test("should set up initial state", () => {
    const newState = restoreArchivedCaseDialogReducer(undefined, {
      type: "some_action"
    });
    expect(newState).toEqual({
      open: false
    });
  });

  test("should set open to true on openDialog", () => {
    const oldState = {
      open: false
    };

    const actualState = restoreArchivedCaseDialogReducer(
      oldState,
      openRestoreArchivedCaseDialog()
    );

    const expectedState = {
      open: true
    };

    expect(actualState).toEqual(expectedState);
  });

  test("should set open to false on closeDialog", () => {
    const newState = restoreArchivedCaseDialogReducer(
      { open: true, some: "old state" },
      closeRestoreArchivedCaseDialog()
    );

    expect(newState).toEqual({ open: false, some: "old state" });
  });
});
