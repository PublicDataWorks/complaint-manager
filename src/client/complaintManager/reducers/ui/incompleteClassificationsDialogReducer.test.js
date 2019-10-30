import incompleteClassificationsDialogReducer from "./incompleteClassificationsDialogReducer";
import {
  closeIncompleteClassificationsDialog,
  openIncompleteClassificationsDialog
} from "../../actionCreators/letterActionCreators";

describe("Incomplete Classifications Dialog reducer", () => {
  test("should initialize state to false open", () => {
    const newState = incompleteClassificationsDialogReducer(undefined, {
      type: "anything"
    });
    expect(newState).toEqual({ open: false });
  });

  test("should set open state to true", () => {
    const initialState = {
      open: false
    };
    const newState = incompleteClassificationsDialogReducer(
      initialState,
      openIncompleteClassificationsDialog()
    );
    const expectedState = {
      open: true
    };
    expect(newState).toEqual(expectedState);
  });

  test("should set open state to false when close missing classifications dialog", () => {
    const initialState = {
      open: true
    };
    const newState = incompleteClassificationsDialogReducer(
      initialState,
      closeIncompleteClassificationsDialog()
    );
    const expectedState = {
      open: false
    };
    expect(newState).toEqual(expectedState);
  });
});
