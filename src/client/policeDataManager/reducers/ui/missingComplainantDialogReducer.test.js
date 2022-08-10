import missingComplainantDialogReducer from "./missingComplainantDialogReducer";
import {
  closeMissingComplainantDialog,
  openMissingComplainantDialog
} from "../../actionCreators/letterActionCreators";

describe("Missing Complainant Dialog reducer", () => {
  test("should initialize state to false open", () => {
    const newState = missingComplainantDialogReducer(undefined, {
      type: "anything"
    });
    expect(newState).toEqual({ open: false });
  });

  test("should set open state to true", () => {
    const initialState = {
      open: false
    };
    const newState = missingComplainantDialogReducer(
      initialState,
      openMissingComplainantDialog()
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
    const newState = missingComplainantDialogReducer(
      initialState,
      closeMissingComplainantDialog()
    );
    const expectedState = {
      open: false
    };
    expect(newState).toEqual(expectedState);
  });
});