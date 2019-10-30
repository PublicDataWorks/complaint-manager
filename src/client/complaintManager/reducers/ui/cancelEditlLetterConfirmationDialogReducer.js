import {
  CLOSE_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG,
  OPEN_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG
} from "../../../../sharedUtilities/constants";

const initialState = { open: false };
const cancelEditLetterConfirmationDialogReducer = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case OPEN_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG:
      return { ...state, open: true };
    case CLOSE_CANCEL_EDIT_LETTER_CONFIRMATION_DIALOG:
      return { ...state, open: false };
    default:
      return state;
  }
};

export default cancelEditLetterConfirmationDialogReducer;
