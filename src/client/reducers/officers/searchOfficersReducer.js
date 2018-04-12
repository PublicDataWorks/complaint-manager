import {
    SEARCH_OFFICERS_SUCCESS, SEARCH_OFFICERS_INITIATED,
    SEARCH_OFFICERS_FAILED
} from "../../../sharedUtilities/constants";

const initialState = {
    searchResults: [],
    spinnerVisible: false
};

const  searchOfficersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_OFFICERS_SUCCESS:
            return { searchResults: action.searchResults, spinnerVisible: false };
        case SEARCH_OFFICERS_INITIATED:
            return { searchResults: [], spinnerVisible: true };
        case SEARCH_OFFICERS_FAILED:
            return { searchResults: [], spinnerVisible: false };
        default:
            return state;
    }
};

export default searchOfficersReducer;