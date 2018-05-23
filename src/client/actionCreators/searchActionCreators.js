import {
  SEARCH_CLEARED,
  SEARCH_FAILED,
  SEARCH_INITIATED,
  SEARCH_SUCCESS
} from "../../sharedUtilities/constants";

export const searchInitiated = () => ({
  type: SEARCH_INITIATED
});

export const searchSuccess = searchResults => ({
  type: SEARCH_SUCCESS,
  searchResults
});

export const searchFailed = () => ({
  type: SEARCH_FAILED
});

export const searchCleared = () => ({
  type: SEARCH_CLEARED
});
