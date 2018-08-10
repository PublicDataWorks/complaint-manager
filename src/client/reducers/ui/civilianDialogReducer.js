import { CIVILIAN_DIALOG_OPENED } from "../../../sharedUtilities/constants";

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
    case "EDIT_DIALOG_CLOSED":
      return initialState;
    default:
      return state;
  }
};

export default civilianDialogReducer;
