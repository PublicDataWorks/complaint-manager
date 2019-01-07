import { GET_RACE_ETHNICITIES_SUCCEEDED } from "../../sharedUtilities/constants";

export const getRaceEthnicitiesSuccess = raceEthnicities => ({
  type: GET_RACE_ETHNICITIES_SUCCEEDED,
  raceEthnicities
});
