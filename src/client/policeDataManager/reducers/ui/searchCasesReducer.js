import {
    SEARCH_CLEARED,
    SEARCH_FAILED,
    SEARCH_INITIATED,
    SEARCH_SUCCESS
  } from "../../../../sharedUtilities/constants";
  
  const initialState = {
    searchResults: [],
    spinnerVisible: false,
    newPage: undefined
  };
  
  const searchCasesReducer = (state = initialState, action) => {
    switch (action.type) {
      case SEARCH_INITIATED:
        return {
          searchResults: [],
          spinnerVisible: true,
          newPage: undefined
        };
      case SEARCH_SUCCESS:
        return {
          searchResults: action.searchResults,
          spinnerVisible: false,
          newPage: action.newPage
        };
      case SEARCH_FAILED:
      case SEARCH_CLEARED:
        return {
          searchResults: [],
          spinnerVisible: false,
          newPage: undefined
        };
      default:
        return state;
    }
  };
  
  export default searchCasesReducer;
  