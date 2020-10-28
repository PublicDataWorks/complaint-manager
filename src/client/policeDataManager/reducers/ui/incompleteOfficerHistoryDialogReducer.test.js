import incompleteOfficerHistoryDialogReducer from "./incompleteOfficerHistoryDialogReducer";
import {
  closeIncompleteOfficerHistoryDialog,
  openIncompleteOfficerHistoryDialog
} from "../../actionCreators/letterActionCreators";
import { CLOSE_INCOMPLETE_OFFICER_HISTORY_DIALOG } from "../../../../sharedUtilities/constants";

describe("EDIT_LETTER_CONFIRMATION_DIALOG", function() {
  test("should initialize state to false open", () => {
    const newState = incompleteOfficerHistoryDialogReducer(undefined, {
      type: "anything"
    });
    expect(newState).toEqual({ open: false });
  });

  test("should set open state to true", () => {
    const initialState = {
      open: false
    };
    const newState = incompleteOfficerHistoryDialogReducer(
      initialState,
      openIncompleteOfficerHistoryDialog(1)
    );
    const expectedState = {
      open: true,
      selectedTab: 1
    };
    expect(newState).toEqual(expectedState);
  });

  test("should set open state to false when close edit letter confirmation dialog", () => {
    const initialState = {
      open: open
    };
    const newState = incompleteOfficerHistoryDialogReducer(
      initialState,
      closeIncompleteOfficerHistoryDialog({
        type: CLOSE_INCOMPLETE_OFFICER_HISTORY_DIALOG
      })
    );
    const expectedState = {
      open: false
    };
    expect(newState).toEqual(expectedState);
  });
});
