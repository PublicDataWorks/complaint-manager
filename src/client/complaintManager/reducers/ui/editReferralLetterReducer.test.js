import editReferralLetterReducer from "./editReferralLetterReducer";
import {
  closeEditLetterConfirmationDialog,
  openEditLetterConfirmationDialog
} from "../../actionCreators/letterActionCreators";

describe("EDIT_LETTER_CONFIRMATION_DIALOG", function() {
  test("should set open state to true", () => {
    const initialState = {
      open: false
    };

    const newState = editReferralLetterReducer(
      initialState,
      openEditLetterConfirmationDialog()
    );
    const expectedState = {
      open: true
    };
    expect(newState).toEqual(expectedState);
  });

  test("should set open state to false when close edit letter confirmation dialog", () => {
    const initialState = {
      open: open
    };
    const newState = editReferralLetterReducer(
      initialState,
      closeEditLetterConfirmationDialog()
    );
    const expectedState = {
      open: false
    };
    expect(newState).toEqual(expectedState);
  });
});
