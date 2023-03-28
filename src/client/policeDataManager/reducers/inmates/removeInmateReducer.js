import {
  CLEAR_SELECTED_INMATE,
  CLEAR_SELECTED_INMATE_SUCCEEDED
} from "../../../../sharedUtilities/constants";

const initialState = {
  inmate: null,
  inmateCurrentlySelected: false
};

const removeInmateReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_SELECTED_INMATE:
      return {
        ...state,
        inmate: null,
        inmateCurrentlySelected: false
      };
    case CLEAR_SELECTED_INMATE_SUCCEEDED:
      return {
        ...state,
        inmate: null,
        inmateCurrentlySelected: false
      };
    default:
      return state;
  }
};

export default removeInmateReducer;
