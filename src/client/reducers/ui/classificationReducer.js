import { GET_CLASSIFICATIONS_SUCCEEDED } from "../../../sharedUtilities/constants";

const initialState = [];

const classificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CLASSIFICATIONS_SUCCEEDED:
      return action.classifications;
    default:
      return state;
  }
};

export default classificationReducer;
