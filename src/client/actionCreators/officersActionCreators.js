import {SEARCH_OFFICERS_SUCCESS} from "../../sharedUtilities/constants";

export const searchOfficersSuccess = (searchResults) => ({
    type: SEARCH_OFFICERS_SUCCESS,
    searchResults
});

