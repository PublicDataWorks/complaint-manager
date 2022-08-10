import { CASE_STATUSES_RETRIEVED } from "../../../../sharedUtilities/constants";

const initialState = {};

const caseStatusesReducer = (state = initialState, action) => {
  switch (action.type) {
    case CASE_STATUSES_RETRIEVED:
      return action.payload.reduce((acc, elem) => {
        if (!acc[elem.name]) {
          acc[elem.name] = elem.orderKey;
        }
        return acc;
      }, {});
    default:
      return state;
  }
};

export default caseStatusesReducer;
