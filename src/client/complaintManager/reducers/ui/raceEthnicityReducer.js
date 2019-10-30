import { GET_RACE_ETHNICITIES_SUCCEEDED } from "../../../../sharedUtilities/constants";

const initialState = [];

const raceEthnicityReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RACE_ETHNICITIES_SUCCEEDED:
      return action.raceEthnicities;
    default:
      return state;
  }
};

export default raceEthnicityReducer;
