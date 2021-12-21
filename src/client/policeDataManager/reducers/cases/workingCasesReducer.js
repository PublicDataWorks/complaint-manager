import {
  CASE_CREATED_SUCCESS,
  GET_WORKING_CASES_SUCCESS,
  RESET_WORKING_CASES_LOADED,
  RESET_WORKING_CASES_PAGING,
  SEARCH_SUCCESS,
  WORKING,
  UPDATE_CASES_TABLE_SORTING,
  SORT_CASES_BY,
  DESCENDING
} from "../../../../sharedUtilities/constants";

const initialState = {
  loaded: false,
  cases: [],
  totalCaseCount: 0,
  currentPage: 1
};
const workingCasesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_SUCCESS:
      const { rows: cases, totalRecords: totalCaseCount } =
        action.searchResults || {};

      return {
        ...state,
        loaded: true,
        cases,
        totalCaseCount,
        currentPage: 1
      };
    case GET_WORKING_CASES_SUCCESS:
      return {
        ...state,
        loaded: true,
        cases: action.cases,
        totalCaseCount: action.totalCaseCount,
        currentPage: action.page
      };
    case RESET_WORKING_CASES_LOADED:
      return { ...state, loaded: false };
    case RESET_WORKING_CASES_PAGING:
      return {
        ...state,
        currentPage: 1,
        sortBy: undefined,
        sortDirection: undefined,
        loaded: false
      };
    case UPDATE_CASES_TABLE_SORTING:
      return action.caseType === WORKING
        ? {
            ...state,
            sortBy: action.sortBy,
            sortDirection: action.sortDirection
          }
        : state;
    case CASE_CREATED_SUCCESS:
      return {
        ...state,
        cases: state.cases.concat(action.caseDetails),
        totalCaseCount: ++state.totalCaseCount
      };
    default:
      return state;
  }
};

export default workingCasesReducer;
