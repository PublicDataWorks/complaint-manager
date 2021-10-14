import {
  DESCENDING,
  RESET_ARCHIVED_CASES_PAGING,
  RESET_WORKING_CASES_PAGING,
  SEARCH_CASES_CLEARED,
  SORT_CASES_BY,
  UPDATE_CASES_TABLE_SORTING
} from "../../../../sharedUtilities/constants";

const initialState = {
  sortBy: SORT_CASES_BY.CASE_REFERENCE,
  sortDirection: DESCENDING
};
const casesTableReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CASES_TABLE_SORTING:
      return {
        sortBy: action.sortBy,
        sortDirection: action.sortDirection
      };
    case RESET_ARCHIVED_CASES_PAGING:
    case RESET_WORKING_CASES_PAGING:
    case SEARCH_CASES_CLEARED:
      return initialState;
    default:
      return state;
  }
};

export default casesTableReducer;
