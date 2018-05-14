import {
  SEARCH_OFFICERS_SUCCESS,
  SEARCH_OFFICERS_INITIATED,
  SEARCH_OFFICERS_FAILED,
  SEARCH_OFFICERS_CLEARED,
  OFFICER_SELECTED,
  CLEAR_SELECTED_OFFICER,
  UNKNOWN_OFFICER_SELECTED
} from "../../../sharedUtilities/constants";

const initialState = {
  searchResults: [],
  spinnerVisible: false,
  selectedOfficerData: null,
  officerCurrentlySelected: false,
  currentCaseOfficer: null
};
const searchOfficersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_OFFICERS_SUCCESS:
      return {
        searchResults: action.searchResults,
        spinnerVisible: false,
        selectedOfficerData: null,
        officerCurrentlySelected: false,
        currentCaseOfficer: null
      };
    case SEARCH_OFFICERS_INITIATED:
      return {
        searchResults: [],
        spinnerVisible: true,
        selectedOfficerData: null,
        officerCurrentlySelected: false,
        currentCaseOfficer: null
      };
    case SEARCH_OFFICERS_FAILED:
      return {
        searchResults: [],
        spinnerVisible: false,
        selectedOfficerData: null,
        officerCurrentlySelected: false,
        currentCaseOfficer: null
      };
    case SEARCH_OFFICERS_CLEARED:
      return {
        ...state,
        searchResults: [],
        spinnerVisible: false,
        currentCaseOfficer: null
      };
    case OFFICER_SELECTED:
      return {
        ...state,
        selectedOfficerData: action.officer,
        officerCurrentlySelected: true,
        currentCaseOfficer: null
      };
    case UNKNOWN_OFFICER_SELECTED:
      return {
        ...state,
        selectedOfficerData: null,
        officerCurrentlySelected: true,
        currentCaseOfficer: null
      };
    case CLEAR_SELECTED_OFFICER:
      return {
        ...state,
        selectedOfficerData: null,
        officerCurrentlySelected: false,
        currentCaseOfficer: null
      };
    default:
      return state;
  }
};

export default searchOfficersReducer;
