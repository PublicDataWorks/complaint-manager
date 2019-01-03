import {
  CREATE_CASE_DIALOG_CLOSED,
  CREATE_CASE_DIALOG_OPENED
} from "../../../sharedUtilities/constants";

const initialState = {
  open: false
};
const createCaseDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_CASE_DIALOG_OPENED:
      return {
        open: true
      };
    case CREATE_CASE_DIALOG_CLOSED:
      return {
        open: false
      };
    default:
      return state;
  }
};

export default createCaseDialogReducer;
