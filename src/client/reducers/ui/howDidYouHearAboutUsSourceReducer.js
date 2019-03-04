import { GET_HOW_DID_YOU_HEAR_ABOUT_US_SOURCES_SUCCEEDED } from "../../../sharedUtilities/constants";

const initialState = [];

const howDidYouHearAboutUsSourceReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_HOW_DID_YOU_HEAR_ABOUT_US_SOURCES_SUCCEEDED:
      return action.howDidYouHearAboutUsSources;
    default:
      return state;
  }
};

export default howDidYouHearAboutUsSourceReducer;
