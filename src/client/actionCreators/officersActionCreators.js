import {
    SEARCH_OFFICERS_SUCCESS, SEARCH_OFFICERS_INITIATED,
    SEARCH_OFFICERS_FAILED, SEARCH_OFFICERS_CLEARED,
    ADD_OFFICER_TO_CASE_SUCCEEDED, ADD_OFFICER_TO_CASE_FAILED,
    OFFICER_SELECTED
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

export const addOfficerToCaseSuccess = (caseDetails) => ({
    type: ADD_OFFICER_TO_CASE_SUCCEEDED,
    caseDetails
})

export const addOfficerToCaseFailure = () => ({
    type: ADD_OFFICER_TO_CASE_FAILED
})

export const selectOfficer = (officer) => ({
    type: OFFICER_SELECTED,
    officer
});