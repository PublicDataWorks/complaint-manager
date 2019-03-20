import {
  ASCENDING,
  DESCENDING,
  SORT_CASES_BY
} from "../../../sharedUtilities/constants";

const initialState = {
  sortBy: "caseReference",
  sortDirection: DESCENDING
};
const casesTableReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SORT_UPDATED":
      if (action.sortBy === state.sortBy) {
        return {
          sortBy: state.sortBy,
          sortDirection: toggleDirection(state.sortDirection)
        };
      }
      return {
        sortBy: action.sortBy,
        sortDirection: ASCENDING
      };
    default:
      return initialState;
  }
};

const toggleDirection = direction => {
  if (direction === DESCENDING) {
    return ASCENDING;
  }

  return DESCENDING;
};

export default casesTableReducer;
