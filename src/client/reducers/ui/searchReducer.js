import {
  SEARCH_CLEARED,
  SEARCH_FAILED,
  SEARCH_INITIATED,
  SEARCH_SUCCESS
} from "../../../sharedUtilities/constants";

const initialState = {
  searchResults: [],
  spinnerVisible: false
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_INITIATED:
      return {
        searchResults: [],
        spinnerVisible: true
      };
    case SEARCH_SUCCESS:
      return {
        searchResults: action.searchResults,
        spinnerVisible: false
      };
    case SEARCH_FAILED:
    case SEARCH_CLEARED:
      return {
        searchResults: [],
        spinnerVisible: false
      };
    default:
      return state;
  }
};

export default searchReducer;
