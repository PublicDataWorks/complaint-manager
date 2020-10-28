import {
  CASE_TAG_DIALOG_CLOSED,
  CASE_TAG_DIALOG_OPENED
} from "../../../../sharedUtilities/constants";

const initialState = {
  open: false
};

const caseTagDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case CASE_TAG_DIALOG_OPENED:
      return {
        open: true
      };
    case CASE_TAG_DIALOG_CLOSED:
      return {
        ...state,
        open: false
      };
    default:
      return state;
  }
};

export default caseTagDialogReducer;
