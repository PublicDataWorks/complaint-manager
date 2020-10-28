import {
  RESTORE_ARCHIVED_CASE_DIALOG_CLOSED,
  RESTORE_ARCHIVED_CASE_DIALOG_OPENED
} from "../../../../sharedUtilities/constants";

const initialState = {
  open: false
};

const restoreArchivedCaseDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESTORE_ARCHIVED_CASE_DIALOG_OPENED:
      return {
        ...state,
        open: true
      };
    case RESTORE_ARCHIVED_CASE_DIALOG_CLOSED:
      return {
        ...state,
        open: false
      };
    default:
      return state;
  }
};

export default restoreArchivedCaseDialogReducer;
