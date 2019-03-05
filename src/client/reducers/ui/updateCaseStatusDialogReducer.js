import {
  CASE_STATUS_UPDATE_DIALOG_CLOSED,
  CASE_STATUS_UPDATE_DIALOG_OPENED,
  CASE_STATUS_UPDATE_DIALOG_SUBMITTING
} from "../../../sharedUtilities/constants";

const initialState = {
  open: false,
  redirectUrl: null,
  submittable: false,
  nextStatus: null
};

const updateCaseStatusDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case CASE_STATUS_UPDATE_DIALOG_OPENED:
      return {
        open: true,
        redirectUrl: action.redirectUrl,
        submittable: true,
        nextStatus: action.nextStatus
      };
    case CASE_STATUS_UPDATE_DIALOG_SUBMITTING:
      return {
        ...state,
        submittable: false
      };
    case CASE_STATUS_UPDATE_DIALOG_CLOSED:
      return {
        ...state,
        open: false,
        redirectUrl: null
      };
    default:
      return state;
  }
};

export default updateCaseStatusDialogReducer;
