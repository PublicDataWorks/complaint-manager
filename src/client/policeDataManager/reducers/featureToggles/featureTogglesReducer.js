import { GET_FEATURES_SUCCEEDED } from "../../../../sharedUtilities/constants";

const featureTogglesReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_FEATURES_SUCCEEDED:
      return action.features;
    default:
      return state;
  }
};

export default featureTogglesReducer;
