import archiveCaseDialogReducer from "./archiveCaseDialogReducer";
import {
  closeArchiveCaseDialog,
  openArchiveCaseDialog
} from "../../actionCreators/casesActionCreators";

describe("archiveCaseDialogReducer", () => {
  test("should set up initial state", () => {
    const newState = archiveCaseDialogReducer(undefined, {
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

    const actualState = archiveCaseDialogReducer(
      oldState,
      openArchiveCaseDialog()
    );

    const expectedState = {
      open: true
    };

    expect(actualState).toEqual(expectedState);
  });

  test("should set open to false on closeDialog", () => {
    const newState = archiveCaseDialogReducer(
      { open: true, some: "old state" },
      closeArchiveCaseDialog()
    );

    expect(newState).toEqual({ open: false, some: "old state" });
  });
});
