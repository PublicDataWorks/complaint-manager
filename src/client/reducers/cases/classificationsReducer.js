import { GET_CLASSIFICATIONS_SUCCESS } from "../../../sharedUtilities/constants";

const initialState = [];

const classificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CLASSIFICATIONS_SUCCESS:
      return action.classifications;
    default:
      return state;
  }
};
export default classificationsReducer;