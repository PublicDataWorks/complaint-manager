import {
  SEARCH_CASES_CLEARED,
  SEARCH_CASES_FAILED,
  SEARCH_CASES_INITIATED,
  SEARCH_CASES_SUCCESS
} from "../../../sharedUtilities/constants";

export const searchCasesInitiated = () => ({
  type: SEARCH_CASES_INITIATED
});

export const searchCasesSuccess = (searchResults, newPage) => ({
  type: SEARCH_CASES_SUCCESS,
  searchResults,
  newPage
});

export const searchCasesFailed = () => ({
  type: SEARCH_CASES_FAILED
});

export const searchCasesCleared = () => ({
  type: SEARCH_CASES_CLEARED
});
