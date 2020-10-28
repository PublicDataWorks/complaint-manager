import {
  CASE_NOTE_DIALOG_CLOSED,
  CASE_NOTE_DIALOG_OPENED
} from "../../../../sharedUtilities/constants";

const initialState = {
  open: false,
  dialogType: "Add",
  initialCaseNote: {}
};
const caseNoteDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case CASE_NOTE_DIALOG_OPENED:
      return {
        open: true,
        dialogType: action.dialogType,
        initialCaseNote: action.initialCaseNote
      };
    case CASE_NOTE_DIALOG_CLOSED:
      return {
        ...state,
        open: false
      };
    default:
      return state;
  }
};

export default caseNoteDialogReducer;
