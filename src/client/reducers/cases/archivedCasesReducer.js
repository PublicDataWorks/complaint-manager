import {
  GET_ARCHIVED_CASES_SUCCESS,
  RESET_ARCHIVED_CASES_LOADED
} from "../../../sharedUtilities/constants";

const initialState = {
  loaded: false,
  cases: [],
  totalCaseCount: 0
};

const archivedCasesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ARCHIVED_CASES_SUCCESS:
      return {
        loaded: true,
        cases: action.cases,
        totalCaseCount: action.totalCaseCount
      };
    case RESET_ARCHIVED_CASES_LOADED:
      return { ...state, loaded: false };
    default:
      return state;
  }
};

export default archivedCasesReducer;
