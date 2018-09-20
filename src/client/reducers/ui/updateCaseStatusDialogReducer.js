import {
  CASE_STATUS_UPDATE_DIALOG_CLOSED,
  CASE_STATUS_UPDATE_DIALOG_OPENED
} from "../../../sharedUtilities/constants";

const initialState = {
  open: false
};
const updateCaseStatusDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case CASE_STATUS_UPDATE_DIALOG_OPENED:
      return {
        open: true
      };
    case CASE_STATUS_UPDATE_DIALOG_CLOSED:
      return {
        open: false
      };
    default:
      return state;
  }
};

export default updateCaseStatusDialogReducer;
