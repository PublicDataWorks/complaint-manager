const initialState = {
  sortBy: "caseReference",
  sortDirection: "desc"
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
        sortDirection: "asc"
      };
    default:
      return initialState;
  }
};

const toggleDirection = direction => {
  if (direction === "desc") {
    return "asc";
  }

  return "desc";
};

export default casesTableReducer;
