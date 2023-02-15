import { GET_FACILITIES } from "../../../sharedUtilities/constants";

const initialState = [];

const facilitiesReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case GET_FACILITIES:
      return action.payload;
    default:
      return state;
  }
};

export default facilitiesReducer;
