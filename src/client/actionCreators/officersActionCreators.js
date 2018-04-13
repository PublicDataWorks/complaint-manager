import {
    SEARCH_OFFICERS_SUCCESS, SEARCH_OFFICERS_INITIATED,
    SEARCH_OFFICERS_FAILED, SEARCH_OFFICERS_CLEARED
} from "../../sharedUtilities/constants";

export const searchOfficersSuccess = (searchResults) => ({
    type: SEARCH_OFFICERS_SUCCESS,
    searchResults
});

export const searchOfficersInitiated = () => ({
    type: SEARCH_OFFICERS_INITIATED
});

export const searchOfficersFailed = () => ({
    type: SEARCH_OFFICERS_FAILED
});

export const searchOfficersCleared = () => ({
    type: SEARCH_OFFICERS_CLEARED
});
