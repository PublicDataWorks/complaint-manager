import {
  REMOVE_CASE_NOTE_DIALOG_CLOSED,
  REMOVE_CASE_NOTE_DIALOG_OPENED
} from "../../../../sharedUtilities/constants";

const initialState = {
  dialogOpen: false,
  activity: {}
};

const removeCaseNoteDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_CASE_NOTE_DIALOG_OPENED:
      return {
        dialogOpen: true,
        activity: action.activity
      };
    case REMOVE_CASE_NOTE_DIALOG_CLOSED:
      return {
        ...initialState,
        activity: state.activity
      };
    default:
      return state;
  }
};

export default removeCaseNoteDialogReducer;
