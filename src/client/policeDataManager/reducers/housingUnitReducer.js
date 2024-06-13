import { GET_HOUSING_UNITS_SUCCEEDED } from "../../../sharedUtilities/constants";

const initialState = [];

const housingUnitReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case GET_HOUSING_UNITS_SUCCEEDED:
        console.log("ACTION",action)
      return action.housingUnits;
    default:
      return state;
  }
};

export default housingUnitReducer;