import {
  SEARCH_SUCCESS,
  SEARCH_FAILED,
  SEARCH_INITIATED,
  OFFICER_SELECTED,
  CLEAR_SELECTED_OFFICER,
  UNKNOWN_OFFICER_SELECTED,
  CASE_OFFICER_SELECTED
} from "../../../sharedUtilities/constants";

const initialState = {
  selectedOfficerData: null,
  officerCurrentlySelected: false
};
const searchOfficersReducer = (state = initialState, action) => {
  switch (action.type) {
    case SEARCH_SUCCESS:
    case SEARCH_INITIATED:
    case SEARCH_FAILED:
      return {
        selectedOfficerData: null,
        officerCurrentlySelected: false
      };
    case OFFICER_SELECTED:
      return {
        selectedOfficerData: action.officer,
        officerCurrentlySelected: true
      };
    case CASE_OFFICER_SELECTED:
      const selectedOfficer = {
        ...action.caseOfficer,
        id: action.caseOfficer.officerId
      };
      return {
        selectedOfficerData: selectedOfficer,
        officerCurrentlySelected: true
      };
    case UNKNOWN_OFFICER_SELECTED:
      return {
        selectedOfficerData: null,
        officerCurrentlySelected: true
      };
    case CLEAR_SELECTED_OFFICER:
      return {
        selectedOfficerData: null,
        officerCurrentlySelected: false
      };
    default:
      return state;
  }
};

export default searchOfficersReducer;
