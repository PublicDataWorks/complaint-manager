import { GET_OFFICER_HISTORY_OPTIONS_SUCCEEDED } from "../../../sharedUtilities/constants";

const initialState = [];

const officerHistoryOptionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_OFFICER_HISTORY_OPTIONS_SUCCEEDED:
      return action.officerHistoryOptions;
    default:
      return state;
  }
};

export default officerHistoryOptionsReducer;
