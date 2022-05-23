import { GET_CONFIGS_SUCCEEDED } from "../../../../sharedUtilities/constants";

const initialState = {};

const configReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CONFIGS_SUCCEEDED:
      return action.payload;
    default:
      return state;
  }
};

export default configReducer;
