import { CASE_CREATED_SUCCESS } from "../../../sharedUtilities/constants";

const allCasesReducer = (state = {cases: [], count: 0}, action) => {
  switch (action.type) {
    case "GET_CASES_SUCCESS":
      return action.data;
    case CASE_CREATED_SUCCESS:
    return {
      cases: state.cases.concat(action.caseDetails),
      count: state.count + 1
    }
    default:
      return state;
  }
};

export default allCasesReducer;
