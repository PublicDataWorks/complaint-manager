import { GET_PERSON_TYPES } from "../../../sharedUtilities/constants";

const initialState = [];

const personTypesReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case GET_PERSON_TYPES:
      return action.payload;
    default:
      return state;
  }
};

export default personTypesReducer;
