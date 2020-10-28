import caseTagDialogReducer from "./caseTagDialogReducer";
import {
  closeCaseTagDialog,
  openCaseTagDialog
} from "../../actionCreators/casesActionCreators";

describe("caseTagDialogReducer", () => {
  test("should set initial state", () => {
    const newState = caseTagDialogReducer(undefined, {
      type: "awesome_action"
    });

    expect(newState).toEqual({
      open: false
    });
  });
  test("should set open to true and set the add tag dialog state on openDialog", () => {
    const oldState = {
      open: false
    };

    const actualState = caseTagDialogReducer(oldState, openCaseTagDialog());

    const expectedState = {
      open: true
    };

    expect(actualState).toEqual(expectedState);
  });
  test("should set open to false and set the add tag dialog state on closeDialog", () => {
    const oldState = {
      open: true
    };

    const actualState = caseTagDialogReducer(oldState, closeCaseTagDialog());

    const expectedState = {
      open: false
    };

    expect(actualState).toEqual(expectedState);
  });
});
