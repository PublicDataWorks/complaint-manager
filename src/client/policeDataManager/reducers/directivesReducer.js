import { GET_DIRECTIVES_SUCCESS } from "../../../sharedUtilities/constants";

const initialState = [];

const directivesReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case GET_DIRECTIVES_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

export default directivesReducer;
