import {
  CASE_CREATED_SUCCESS,
  GET_WORKING_CASES_SUCCESS,
  RESET_WORKING_CASES_LOADED
} from "../../../sharedUtilities/constants";

const initialState = {
  loaded: false,
  cases: []
};
const workingCasesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_WORKING_CASES_SUCCESS:
      return { loaded: true, cases: action.cases };
    case RESET_WORKING_CASES_LOADED:
      return { ...state, loaded: false };
    case CASE_CREATED_SUCCESS:
      return { ...state, cases: state.cases.concat(action.caseDetails) };
    default:
      return state;
  }
};

export default workingCasesReducer;
