import {
  EDIT_ALLEGATION_FORM_CLOSED,
  EDIT_ALLEGATION_FORM_DATA_CLEARED,
  EDIT_ALLEGATION_FORM_OPENED,
  UPDATE_ALLEGATION_DETAILS_SUCCEEDED
} from "../../../sharedUtilities/constants";

const editAllegationFormsReducer = (state = {}, action) => {
  switch (action.type) {
    case EDIT_ALLEGATION_FORM_OPENED: {
      return {
        ...state,
        [action.allegationId]: { editMode: true }
      };
    }
    case UPDATE_ALLEGATION_DETAILS_SUCCEEDED:
    case EDIT_ALLEGATION_FORM_CLOSED: {
      return {
        ...state,
        [action.allegationId]: { editMode: false }
      };
    }
    case EDIT_ALLEGATION_FORM_DATA_CLEARED: {
      return {};
    }
    default:
      return state;
  }
};

export default editAllegationFormsReducer;
