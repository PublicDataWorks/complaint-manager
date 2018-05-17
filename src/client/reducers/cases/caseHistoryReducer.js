import { GET_CASE_HISTORY_SUCCESS } from "../../../sharedUtilities/constants";

const initialState = [];
const caseHistoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CASE_HISTORY_SUCCESS:
      return action.caseHistory;
    default:
      return state;
  }
};

export default caseHistoryReducer;
