import { GET_HEARD_ABOUT_SOURCES_SUCCEEDED } from "../../sharedUtilities/constants";

export const getHeardAboutSourcesSuccess = heardAboutSources => ({
  type: GET_HEARD_ABOUT_SOURCES_SUCCEEDED,
  heardAboutSources
});
