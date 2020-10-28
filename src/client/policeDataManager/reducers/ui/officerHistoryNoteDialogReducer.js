import {
  REMOVE_OFFICER_HISTORY_NOTE_DIALOG_CLOSED,
  REMOVE_OFFICER_HISTORY_NOTE_DIALOG_OPENED
} from "../../../../sharedUtilities/constants";

const initialValues = {
  dialogOpen: false,
  fieldArrayName: undefined,
  noteIndex: undefined,
  noteDetails: {}
};

const officerHistoryNoteDialogReducer = (state = initialValues, action) => {
  switch (action.type) {
    case REMOVE_OFFICER_HISTORY_NOTE_DIALOG_OPENED:
      return {
        ...state,
        dialogOpen: true,
        fieldArrayName: action.fieldArrayName,
        noteIndex: action.noteIndex,
        noteDetails: action.noteDetails
      };
    case REMOVE_OFFICER_HISTORY_NOTE_DIALOG_CLOSED:
      return {
        ...state,
        dialogOpen: false,
        fieldArrayName: undefined,
        noteIndex: undefined,
        noteDetails: {}
      };
    default:
      return state;
  }
};

export default officerHistoryNoteDialogReducer;
