import { CASE_STATUSES_RETRIEVED } from "../../../../sharedUtilities/constants";

const initialState = [];

const caseStatusesReducer = (state = initialState, action) => {
  switch (action.type) {
    case CASE_STATUSES_RETRIEVED:
      return action.payload;
    default:
      return state;
  }
};

export default caseStatusesReducer;
