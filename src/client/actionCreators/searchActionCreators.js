import {
  SEARCH_FAILED,
  SEARCH_INITIATED,
  SEARCH_SUCCESS
} from "../../sharedUtilities/constants";

export const searchInitiated = () => ({
  type: SEARCH_INITIATED
});

export const searchSuccess = (searchResults, newPage) => ({
  type: SEARCH_SUCCESS,
  searchResults,
  newPage
});

export const searchFailed = () => ({
  type: SEARCH_FAILED
});
