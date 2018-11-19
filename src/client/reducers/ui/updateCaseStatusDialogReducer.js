import {
  CASE_STATUS_UPDATE_DIALOG_CLOSED,
  CASE_STATUS_UPDATE_DIALOG_OPENED
} from "../../../sharedUtilities/constants";

const initialState = {
  open: false,
  redirectUrl: null
};

const updateCaseStatusDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case CASE_STATUS_UPDATE_DIALOG_OPENED:
      return {
        open: true,
        redirectUrl: action.redirectUrl
      };
    case CASE_STATUS_UPDATE_DIALOG_CLOSED:
      return {
        open: false,
        redirectUrl: null
      };
    default:
      return state;
  }
};

export default updateCaseStatusDialogReducer;
