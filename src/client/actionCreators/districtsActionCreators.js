import { GET_DISTRICTS_SUCCEEDED } from "../../sharedUtilities/constants";

export const getDistrictsSuccess = districts => {
  return {
    type: GET_DISTRICTS_SUCCEEDED,
    districts
  };
};
