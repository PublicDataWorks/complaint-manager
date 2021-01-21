import {
  CLOSE_MISSING_COMPLAINANT_DIALOG,
  OPEN_MISSING_COMPLAINANT_DIALOG
} from "../../../../sharedUtilities/constants";

const initialState = { open: false };
const missingComplainantDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_MISSING_COMPLAINANT_DIALOG:
      return { ...state, open: true };
    case CLOSE_MISSING_COMPLAINANT_DIALOG:
      return { ...state, open: false };
    default:
      return state;
  }
};

export default missingComplainantDialogReducer;
