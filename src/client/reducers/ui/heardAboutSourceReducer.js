import { GET_HEARD_ABOUT_SOURCES_SUCCEEDED } from "../../../sharedUtilities/constants";

const initialState = [];

const heardAboutSourceReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_HEARD_ABOUT_SOURCES_SUCCEEDED:
      return action.heardAboutSources;
    default:
      return state;
  }
};

export default heardAboutSourceReducer;
