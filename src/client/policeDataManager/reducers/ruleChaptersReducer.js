import { GET_RULE_CHAPTERS_SUCCESS } from "../../../sharedUtilities/constants";

const initialState = [];

const ruleChaptersReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case GET_RULE_CHAPTERS_SUCCESS:
      return action.payload;
    default:
      return state;
  }
};

export default ruleChaptersReducer;
