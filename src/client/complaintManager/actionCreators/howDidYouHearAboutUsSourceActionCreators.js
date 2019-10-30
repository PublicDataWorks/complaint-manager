import { GET_HOW_DID_YOU_HEAR_ABOUT_US_SOURCES_SUCCEEDED } from "../../../sharedUtilities/constants";

export const getHowDidYouHearAboutUsSourcesSuccess = howDidYouHearAboutUsSources => ({
  type: GET_HOW_DID_YOU_HEAR_ABOUT_US_SOURCES_SUCCEEDED,
  howDidYouHearAboutUsSources
});
