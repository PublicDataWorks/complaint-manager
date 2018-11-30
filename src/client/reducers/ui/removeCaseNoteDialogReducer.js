import {
  REMOVE_CASE_NOTE_BUTTON_DISABLED,
  REMOVE_CASE_NOTE_DIALOG_CLOSED,
  REMOVE_CASE_NOTE_DIALOG_OPENED
} from "../../../sharedUtilities/constants";

const initialState = {
  dialogOpen: false,
  activity: {},
  removeCaseButtonDisabled: false
};

const removeCaseNoteDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_CASE_NOTE_DIALOG_OPENED:
      return {
        ...state,
        dialogOpen: true,
        activity: action.activity
      };
    case REMOVE_CASE_NOTE_DIALOG_CLOSED:
      return {
        ...state,
        dialogOpen: !state.dialogOpen
      };
    case REMOVE_CASE_NOTE_BUTTON_DISABLED:
      return {
        ...state,
        removeCaseButtonDisabled: !state.removeCaseButtonDisabled
      };
    default:
      return state;
  }
};

export default removeCaseNoteDialogReducer;
