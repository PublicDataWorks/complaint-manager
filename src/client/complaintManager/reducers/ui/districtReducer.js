import { GET_DISTRICTS_SUCCEEDED } from "../../../../sharedUtilities/constants";

const initialState = [];

const districtReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_DISTRICTS_SUCCEEDED:
      return action.districts;
    default:
      return state;
  }
};

export default districtReducer;
