import { GET_PRIORITY_LEVEL_SUCCEEDED } from "../../../../sharedUtilities/constants";

const initialState = [];

const priorityLevelReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PRIORITY_LEVEL_SUCCEEDED:
      return action.priorityLevels;
    default:
      return state;
  }
};

export default priorityLevelReducer;
