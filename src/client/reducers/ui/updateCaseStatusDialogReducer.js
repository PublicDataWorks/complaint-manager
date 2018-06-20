import {
  CASE_STATUS_UPDATE_DIALOG_CLOSED,
  CASE_STATUS_UPDATE_DIALOG_OPENED
} from "../../../sharedUtilities/constants";

const initialState = {
  open: false,
  nextStatus: ""
};
const updateCaseStatusDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case CASE_STATUS_UPDATE_DIALOG_OPENED:
      return {
        open: true,
        nextStatus: action.nextStatus
      };
    case CASE_STATUS_UPDATE_DIALOG_CLOSED:
      return {
        open: false,
        nextStatus: state.nextStatus
      };
    default:
      return state;
  }
};

export default updateCaseStatusDialogReducer;
