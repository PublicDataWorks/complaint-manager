import {
  CIVILIAN_DIALOG_OPENED,
  EDIT_CIVILIAN_DIALOG_CLOSED
} from "../../../sharedUtilities/constants";

const initialState = {
  open: false,
  title: "",
  submitButtonText: "",
  submitAction: undefined
};

const civilianDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case CIVILIAN_DIALOG_OPENED:
      return {
        ...state,
        open: true,
        title: action.title,
        submitButtonText: action.submitButtonText,
        submitAction: action.submitAction
      };
    case EDIT_CIVILIAN_DIALOG_CLOSED:
      return initialState;
    default:
      return state;
  }
};

export default civilianDialogReducer;
