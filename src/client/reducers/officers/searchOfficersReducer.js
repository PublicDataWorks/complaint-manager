import {SEARCH_OFFICERS_SUCCESS} from "../../../sharedUtilities/constants";

const initialState = {
    searchResults: []
};

const  searchOfficersReducer = (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_OFFICERS_SUCCESS:
            return { searchResults: action.searchResults };
        default:
            return state;
    }
};

export default searchOfficersReducer;