import { GET_CIVILIAN_TITLES_SUCCEEDED } from "../../../sharedUtilities/constants";

export const getCivilianTitlesSuccess = civilianTitles => {
  return {
    type: GET_CIVILIAN_TITLES_SUCCEEDED,
    civilianTitles
  };
};
