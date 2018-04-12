import {
    SEARCH_OFFICERS_SUCCESS, SEARCH_OFFICERS_INITIATED,
    SEARCH_OFFICERS_FAILED
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
