import {
  ADD_OFFICER_TO_CASE_SUCCEEDED,
  ADD_CASE_NOTE_SUCCEEDED,
  CIVILIAN_CREATION_SUCCEEDED,
  INCIDENT_DETAILS_UPDATE_SUCCEEDED,
  REMOVE_ATTACHMENT_SUCCESS,
  REMOVE_PERSON_SUCCEEDED,
  REMOVE_CASE_NOTE_SUCCEEDED,
  ADD_OFFICER_ALLEGATION_SUCCEEDED,
  CASE_STATUS
} from "../../../sharedUtilities/constants";

const initialState = {};

const caseDetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_CASE_DETAILS_SUCCESS":
    case "NARRATIVE_UPDATE_SUCCEEDED":
    case "ATTACHMENT_UPLOAD_SUCCEEDED":
    case INCIDENT_DETAILS_UPDATE_SUCCEEDED:
    case REMOVE_ATTACHMENT_SUCCESS:
    case REMOVE_PERSON_SUCCEEDED:
    case ADD_OFFICER_TO_CASE_SUCCEEDED:
    case REMOVE_CASE_NOTE_SUCCEEDED:
    case "EDIT_CIVILIAN_SUCCESS":
    case CIVILIAN_CREATION_SUCCEEDED:
    case ADD_OFFICER_ALLEGATION_SUCCEEDED:
      return action.caseDetails;
    case ADD_CASE_NOTE_SUCCEEDED:
      return {
        ...state,
        status: state.status === CASE_STATUS.INITIAL ? CASE_STATUS.ACTIVE : state.status
      };
    default:
      return state;
  }
};

export default caseDetailsReducer;
