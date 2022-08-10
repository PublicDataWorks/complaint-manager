import {
  ARCHIVE,
  GET_ARCHIVED_CASES_SUCCESS,
  RESET_ARCHIVED_CASES_LOADED,
  RESET_ARCHIVED_CASES_PAGING,
  UPDATE_CASES_TABLE_SORTING,
  SORT_CASES_BY,
  DESCENDING
} from "../../../../sharedUtilities/constants";

const initialState = {
  loaded: false,
  cases: [],
  totalCaseCount: 0,
  currentPage: 1,
  sortBy: SORT_CASES_BY.CASE_REFERENCE,
  sortDirection: DESCENDING
};

const archivedCasesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ARCHIVED_CASES_SUCCESS:
      return {
        ...state,
        loaded: true,
        cases: action.cases,
        totalCaseCount: action.totalCaseCount,
        currentPage: action.page
      };
    case RESET_ARCHIVED_CASES_LOADED:
      return { ...state, loaded: false };
    case RESET_ARCHIVED_CASES_PAGING:
      return {
        ...state,
        currentPage: 1,
        sortBy: SORT_CASES_BY.CASE_REFERENCE,
        sortDirection: DESCENDING,
        loaded: false
      };
    case UPDATE_CASES_TABLE_SORTING:
      return action.caseType === ARCHIVE
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

export default archivedCasesReducer;
