import {
  REMOVE_PERSON_DIALOG_CLOSED,
  REMOVE_PERSON_DIALOG_OPENED
} from "../../../sharedUtilities/constants";

const initialState = {
  open: false,
  personDetails: {},
  optionalText: "",
  personTypeTitleDisplay: ""
};

const removePersonDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_PERSON_DIALOG_OPENED:
      return {
        open: true,
        personDetails: action.personDetails,
        optionalText: action.optionalText,
        personTypeTitleDisplay: action.personTypeTitleDisplay
      };
    case REMOVE_PERSON_DIALOG_CLOSED:
      return initialState;
    default:
      return state;
  }
};

export default removePersonDialogReducer;
