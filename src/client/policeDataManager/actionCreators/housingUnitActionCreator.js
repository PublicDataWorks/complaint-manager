import { GET_HOUSING_UNITS_SUCCEEDED } from "../../../sharedUtilities/constants";

export const getHousingUnitsSuccess = housingUnits => {
  return {
    type: GET_HOUSING_UNITS_SUCCEEDED,
    housingUnits
  };
};