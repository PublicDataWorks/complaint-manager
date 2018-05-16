import {
  CIVILIAN_ADDRESS_AUTOSUGGEST_UPDATED,
  CIVILIAN_DIALOG_OPENED
} from "../../../sharedUtilities/constants";

const initialState = {
  open: false,
  title: "",
  submitButtonText: "",
  submitAction: undefined,
  addressAutoSuggestValue: ""
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
    case CIVILIAN_ADDRESS_AUTOSUGGEST_UPDATED:
      return {
        ...state,
        addressAutoSuggestValue: action.addressValue
      };
    default:
      return state;
  }
};

export default civilianDialogReducer;
