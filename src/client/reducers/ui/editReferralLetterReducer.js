import {
  OPEN_EDIT_LETTER_CONFIRMATION_DIALOG,
  CLOSE_EDIT_LETTER_CONFIRMATION_DIALOG
} from "../../../sharedUtilities/constants";

const initialState = { open: false };
const editReferralLetterReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_EDIT_LETTER_CONFIRMATION_DIALOG:
      return { ...state, open: true };
    case CLOSE_EDIT_LETTER_CONFIRMATION_DIALOG:
      return { ...state, open: false };
    default:
      return state;
  }
};

export default editReferralLetterReducer;
