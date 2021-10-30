import {
  DESCENDING,
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
    default:
      return state;
  }
};

export default casesTableReducer;
