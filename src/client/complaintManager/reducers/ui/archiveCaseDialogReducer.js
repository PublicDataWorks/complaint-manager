import {
  ARCHIVE_CASE_DIALOG_CLOSED,
  ARCHIVE_CASE_DIALOG_OPENED
} from "../../../../sharedUtilities/constants";

const initialState = {
  open: false
};

const archiveCaseDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case ARCHIVE_CASE_DIALOG_OPENED:
      return {
        ...state,
        open: true
      };
    case ARCHIVE_CASE_DIALOG_CLOSED:
      return {
        ...state,
        open: false
      };
    default:
      return state;
  }
};

export default archiveCaseDialogReducer;
