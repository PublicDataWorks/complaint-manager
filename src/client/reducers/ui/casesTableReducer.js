import { DEFAULT_PAGINATION_LIMIT } from "../../../sharedUtilities/constants";

const initialState = {
  sortBy: "id",
  sortDirection: "desc",
  page: 0,
  pageSize: DEFAULT_PAGINATION_LIMIT
};

const casesTableReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SORT_UPDATED":
      if (action.sortBy === state.sortBy) {
        return {
          ...state,
          sortBy: state.sortBy,
          sortDirection: toggleDirection(state.sortDirection)
        };
      }
      return {
        ...state,
        sortBy: action.sortBy,
        sortDirection: "asc"
      };
  case "PAGE_UPDATED":
    return { ...state, page: action.page };
  default:
    return state;
  }
};

const toggleDirection = direction => {
  if (direction === "desc") {
    return "asc";
  }

  return "desc";
};

export default casesTableReducer;
