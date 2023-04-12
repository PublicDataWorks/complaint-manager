import {
  CLEAR_SELECTED_INMATE,
  SET_SELECTED_INMATE
} from "../../../../sharedUtilities/constants";

const initialState = {};

const inmateDetailsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_SELECTED_INMATE:
      return action.payload || {};
    case CLEAR_SELECTED_INMATE:
      return {};
    default:
      return state;
  }
};

export default inmateDetailsReducer;
