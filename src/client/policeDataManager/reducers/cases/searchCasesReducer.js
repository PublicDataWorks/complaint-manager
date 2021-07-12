import {
  CASE_CREATED_SUCCESS,
  GET_WORKING_CASES_SUCCESS,
  RESET_WORKING_CASES_LOADED,
  SEARCH_CASES_SUCCESS,
  SEARCH_FAILED,
  SEARCH_SUCCESS
} from "../../../../sharedUtilities/constants";

const initialState = {
  loaded: false,
  cases: [],
  totalCaseCount: 0,
  currentPage: 1,
  errorMsg: null
};
const searchCasesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_CASES_SUCCESS:
      const { rows: cases, totalRecords: totalCaseCount } =
        action.searchResults || {};

      return {
        loaded: true,
        cases,
        totalCaseCount,
        currentPage: 1
      };
    case SEARCH_FAILED:
      return {
        ...state,
        loaded: true,
        errorMsg: action.payload
      };
    default:
      return state;
  }
};

export default searchCasesReducer;
