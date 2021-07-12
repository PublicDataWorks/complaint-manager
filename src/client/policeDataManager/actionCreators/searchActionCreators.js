import {
  SEARCH_CLEARED,
  SEARCH_FAILED,
  SEARCH_INITIATED,
  SEARCH_SUCCESS
} from "../../../sharedUtilities/constants";

export const searchInitiated = () => ({
  type: SEARCH_INITIATED
});

export const searchSuccess = (searchResults, newPage) => ({
  type: SEARCH_SUCCESS,
  searchResults,
  newPage
});

export const searchFailed = (message = "Invalid search, Please try again") => ({
  type: SEARCH_FAILED,
  payload: message
});

export const searchCleared = () => ({
  type: SEARCH_CLEARED
});
