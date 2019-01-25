import {
  EDIT_INCIDENT_DETAILS_DIALOG_CLOSED,
  EDIT_INCIDENT_DETAILS_DIALOG_OPENED
} from "../../../sharedUtilities/constants";

const initialState = {
  open: false
};

const editIncidentDetailsDialogReducer = (state = initialState, action) => {
  switch (action.type) {
    case EDIT_INCIDENT_DETAILS_DIALOG_OPENED:
      return {
        ...state,
        open: true
      };
    case EDIT_INCIDENT_DETAILS_DIALOG_CLOSED:
      return initialState;
    default:
      return state;
  }
};

export default editIncidentDetailsDialogReducer;
