import {
    SEARCH_OFFICERS_SUCCESS, SEARCH_OFFICERS_INITIATED,
    SEARCH_OFFICERS_FAILED, SEARCH_OFFICERS_CLEARED,
    OFFICER_SELECTED, CLEAR_SELECTED_OFFICER
} from "../../../sharedUtilities/constants";

const initialState = {
    searchResults: [],
    spinnerVisible: false,
    selectedOfficer: null
};

const  searchOfficersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_OFFICERS_SUCCESS:
            return { searchResults: action.searchResults, spinnerVisible: false, selectedOfficer: null };
        case SEARCH_OFFICERS_INITIATED:
            return { searchResults: [], spinnerVisible: true, selectedOfficer: null };
        case SEARCH_OFFICERS_FAILED:
            return { searchResults: [], spinnerVisible: false, selectedOfficer: null };
        case SEARCH_OFFICERS_CLEARED:
            return { ...state, searchResults: [], spinnerVisible: false };
        case OFFICER_SELECTED:
            return { ...state, selectedOfficer: action.officer };
        case CLEAR_SELECTED_OFFICER:
            return { ...state, selectedOfficer: null};
        default:
            return state;
    }
};

export default searchOfficersReducer;