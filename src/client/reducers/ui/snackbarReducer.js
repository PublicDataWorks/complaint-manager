import {
  ADD_CASE_NOTE_FAILED,
  ADD_CASE_NOTE_SUCCEEDED,
  ADD_OFFICER_TO_CASE_FAILED,
  ATTACHMENT_UPLOAD_FAILED,
  ATTACHMENT_UPLOAD_SUCCEEDED,
  BG_JOB_FAILED,
  CASE_CREATED_SUCCESS,
  CIVILIAN_CREATION_FAILED,
  CIVILIAN_CREATION_SUCCEEDED,
  DOWNLOAD_FAILED,
  EDIT_CASE_NOTE_FAILED,
  EDIT_CASE_NOTE_SUCCEEDED,
  EDIT_CASE_OFFICER_FAILED,
  EDIT_CASE_OFFICER_SUCCEEDED,
  GET_ALLEGATIONS_FAILED,
  INCIDENT_DETAILS_UPDATE_FAILED,
  INCIDENT_DETAILS_UPDATE_SUCCEEDED,
  REMOVE_ATTACHMENT_FAILED,
  REMOVE_ATTACHMENT_SUCCESS,
  REMOVE_CASE_NOTE_FAILED,
  REMOVE_CASE_NOTE_SUCCEEDED,
  REMOVE_PERSON_FAILED,
  REMOVE_PERSON_SUCCEEDED,
  SNACKBAR_ERROR,
  SNACKBAR_SUCCESS
} from "../../../sharedUtilities/constants";

//TODO Discuss separation of concerns.
// Refactoring 1:  Use 1 global snackbar, don't worry about collisions.  Have thunk dispatch generic success/failure/pending with parameterized messages.  Puts presentation logic in thunk.  wah wah
/*    case 'REQUESTED':
            return {
                open: false,
                success: false,
                message: <parameterized>
            }
        case 'SUCCESS':
            return {
                open: true,
                success: true,
                message: <parameterized>
            }
        case 'SERVER_ERROR':
            return {
                open: true,
                success: false,
                message: <parameterized>
            }
        default:
            return state
*/
// Refactoring 2:  Instantiate different snackbars for each type of business event so that one success event can't dismiss another failure's red snackbar.

const initialState = { open: false, success: false, message: "" };
const snackbarReducer = (state = initialState, action) => {
  switch (action.type) {
    case SNACKBAR_ERROR:
      return {
        open: true,
        success: false,
        message: action.message
      };
    case SNACKBAR_SUCCESS:
      return {
        open: true,
        success: true,
        message: action.message
      };
    case "CLOSE_SNACKBAR":
      return {
        open: false,
        success: state.success,
        message: state.message
      };
    case "USER_CREATION_REQUESTED":
      return {
        open: false,
        success: false,
        message: ""
      };
    case "USER_CREATED_SUCCESS":
      return {
        open: true,
        success: true,
        message: "User was successfully created."
      };
    case "USER_CREATION_FAILED":
      return {
        open: true,
        success: false,
        message:
          "Something went wrong and the user was not created. Please try again."
      };
    case "CASE_CREATION_REQUESTED":
      return {
        open: false,
        success: false,
        message: ""
      };
    case CASE_CREATED_SUCCESS:
      return {
        open: true,
        success: true,
        message: `Case ${action.caseDetails.id} was successfully created.`
      };
    case "CASE_CREATION_FAILED":
      return {
        open: true,
        success: false,
        message:
          "Something went wrong and the case was not created. Please try again."
      };
    case "NARRATIVE_UPDATE_SUCCEEDED":
      return {
        open: true,
        success: true,
        message: "Narrative was successfully updated"
      };
    case "NARRATIVE_UPDATE_FAILED":
      return {
        open: true,
        success: false,
        message:
          "Something went wrong and the case was not updated. Please try again."
      };
    case INCIDENT_DETAILS_UPDATE_SUCCEEDED:
      return {
        open: true,
        success: true,
        message: "Incident details were successfully updated"
      };
    case INCIDENT_DETAILS_UPDATE_FAILED:
      return {
        open: true,
        success: false,
        message:
          "Something went wrong and the case was not updated. Please try again."
      };
    case CIVILIAN_CREATION_SUCCEEDED:
      return {
        open: true,
        success: true,
        message: "Civilian was successfully added"
      };
    case CIVILIAN_CREATION_FAILED:
      return {
        open: true,
        success: false,
        message:
          "Something went wrong and the civilian was not created. Please try again."
      };
    case REMOVE_PERSON_FAILED:
      return {
        open: true,
        success: false,
        message: action.message
      };
    case REMOVE_PERSON_SUCCEEDED:
      return {
        open: true,
        success: true,
        message: action.message
      };
    case "EDIT_CIVILIAN_SUCCESS":
      return {
        open: true,
        success: true,
        message: "Civilian was successfully updated"
      };
    case "EDIT_CIVILIAN_FAILED":
      return {
        open: true,
        success: false,
        message:
          "Something went wrong and the civilian was not updated. Please try again."
      };
    case ATTACHMENT_UPLOAD_SUCCEEDED:
      return {
        open: true,
        success: true,
        message: "File was successfully attached"
      };
    case ATTACHMENT_UPLOAD_FAILED:
      return {
        open: true,
        success: false,
        message:
          "Something went wrong and the file was not attached. Please try again."
      };
    case REMOVE_ATTACHMENT_SUCCESS:
      return {
        open: true,
        success: true,
        message: "File was successfully removed"
      };
    case REMOVE_ATTACHMENT_FAILED:
      return {
        open: true,
        success: false,
        message:
          "Something went wrong and the file was not removed. Please try again."
      };
    case DOWNLOAD_FAILED:
      return {
        open: true,
        success: false,
        message:
          "Something went wrong and the file was not downloaded. Please try again."
      };
    case ADD_OFFICER_TO_CASE_FAILED:
      return {
        open: true,
        success: false,
        message:
          "Something went wrong and the officer was not added. Please try again."
      };
    case ADD_CASE_NOTE_SUCCEEDED:
      return {
        success: true,
        open: true,
        message: "Case note was successfully created"
      };
    case ADD_CASE_NOTE_FAILED:
      return {
        success: false,
        open: true,
        message:
          "Something went wrong and the case note was not created. Please try again."
      };
    case EDIT_CASE_NOTE_SUCCEEDED:
      return {
        success: true,
        open: true,
        message: "Case note was successfully updated."
      };
    case EDIT_CASE_NOTE_FAILED:
      return {
        success: false,
        open: true,
        message:
          "Something went wrong and the case note was not updated. Please try again."
      };
    case REMOVE_CASE_NOTE_SUCCEEDED:
      return {
        success: true,
        open: true,
        message: "Case note was successfully removed"
      };
    case REMOVE_CASE_NOTE_FAILED:
      return {
        success: false,
        open: true,
        message:
          "Something went wrong and the case note was not removed. Please try again."
      };
    case EDIT_CASE_OFFICER_SUCCEEDED:
      return {
        open: true,
        success: true,
        message: "Officer was successfully updated"
      };
    case EDIT_CASE_OFFICER_FAILED:
      return {
        success: false,
        open: true,
        message:
          "Something went wrong and the officer was not updated. Please try again."
      };
    case GET_ALLEGATIONS_FAILED:
      return {
        success: false,
        open: true,
        message:
          "Something went wrong and the allegations were not loaded. Please try again."
      };
    case BG_JOB_FAILED:
      return {
        success: false,
        open: true,
        message:
          "Something went wrong and your export failed. Please try again."
      };
    default:
      return state;
  }
};
export default snackbarReducer;
