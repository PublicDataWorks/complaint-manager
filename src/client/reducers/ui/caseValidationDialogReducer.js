import {
  CASE_VALIDATION_DIALOG_CLOSED,
  CASE_VALIDATION_DIALOG_OPENED
} from "../../../sharedUtilities/constants";

const initialState = {
  open: false,
  redirectUrl: null,
  validationErrors: []
};

const caseValidationDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case CASE_VALIDATION_DIALOG_OPENED:
      return {
        open: true,
        redirectUrl: null,
        validationErrors: action.errors
      };
    case CASE_VALIDATION_DIALOG_CLOSED:
      return {
        ...state,
        open: false
      };
    default:
      return state;
  }
};

export default caseValidationDialogReducer;
