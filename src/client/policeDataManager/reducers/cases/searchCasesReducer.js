import {
  SEARCH,
  SEARCH_CASES_CLEARED,
  SEARCH_CASES_SUCCESS,
  SEARCH_FAILED,
  UPDATE_CASES_TABLE_SORTING,
  SORT_CASES_BY,
  DESCENDING
} from "../../../../sharedUtilities/constants";

const initialState = {
  loaded: false,
  cases: [],
  totalCaseCount: 0,
  currentPage: 1,
  errorMsg: null,
  sortBy: SORT_CASES_BY.CASE_REFERENCE,
  sortDirection: DESCENDING
};
const searchCasesReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_CASES_SUCCESS:
      const { rows: cases, totalRecords: totalCaseCount } =
        action.searchResults || {};
      const currentPage = action.newPage;

      return {
        ...state,
        loaded: true,
        cases,
        totalCaseCount,
        currentPage
      };
    case SEARCH_FAILED:
      return {
        ...state,
        loaded: true,
        errorMsg: action.payload
      };
    case SEARCH_CASES_CLEARED:
      return {
        ...state,
        loaded: false,
        currentPage: 1,
        sortBy: SORT_CASES_BY.CASE_REFERENCE,
        sortDirection: DESCENDING
      };
    case UPDATE_CASES_TABLE_SORTING:
      return action.caseType === SEARCH
        ? {
            ...state,
            sortBy: action.sortBy,
            sortDirection: action.sortDirection
          }
        : state;
    default:
      return state;
  }
};

export default searchCasesReducer;
