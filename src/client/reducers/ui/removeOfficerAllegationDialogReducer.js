import {
  REMOVE_ALLEGATION_DIALOG_OPENED,
  REMOVE_ALLEGATION_DIALOG_CLOSED,
  REMOVE_OFFICER_ALLEGATION_SUCCEEDED
} from "../../../sharedUtilities/constants";

const initialState = { open: false, allegation: {} };

const removeOfficerAllegationDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_ALLEGATION_DIALOG_OPENED:
      return { open: true, allegation: action.allegation };
    case REMOVE_ALLEGATION_DIALOG_CLOSED:
    case REMOVE_OFFICER_ALLEGATION_SUCCEEDED:
      return { ...state, open: false };
    default:
      return state;
  }
};

export default removeOfficerAllegationDialogReducer;
