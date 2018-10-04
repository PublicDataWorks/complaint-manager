import {
  ADD_OFFICER_TO_CASE_FAILED,
  ADD_CASE_NOTE_FAILED,
  ADD_CASE_NOTE_SUCCEEDED,
  ATTACHMENT_UPLOAD_FAILED,
  ATTACHMENT_UPLOAD_SUCCEEDED,
  CASE_CREATED_SUCCESS,
  CIVILIAN_CREATION_FAILED,
  CIVILIAN_CREATION_SUCCEEDED,
  DOWNLOAD_FAILED,
  EDIT_CASE_OFFICER_FAILED,
  EDIT_CASE_OFFICER_SUCCEEDED,
  EDIT_CASE_NOTE_FAILED,
  EDIT_CASE_NOTE_SUCCEEDED,
  INCIDENT_DETAILS_UPDATE_FAILED,
  INCIDENT_DETAILS_UPDATE_SUCCEEDED,
  REMOVE_ATTACHMENT_FAILED,
  REMOVE_ATTACHMENT_SUCCESS,
  REMOVE_PERSON_FAILED,
  REMOVE_PERSON_SUCCEEDED,
  REMOVE_CASE_NOTE_FAILED,
  REMOVE_CASE_NOTE_SUCCEEDED,
  SNACKBAR_ERROR,
  SNACKBAR_SUCCESS,
  GET_ALLEGATIONS_FAILED
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
          "Something went wrong on our end and your user was not created. Please try again."
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
          "Something went wrong on our end and your case was not created. Please try again."
      };
    case "NARRATIVE_UPDATE_SUCCEEDED":
      return {
        open: true,
        success: true,
        message: "Your narrative was successfully updated"
      };
    case "NARRATIVE_UPDATE_FAILED":
      return {
        open: true,
        success: false,
        message:
          "Something went wrong on our end and your case was not updated. Please try again."
      };
    case INCIDENT_DETAILS_UPDATE_SUCCEEDED:
      return {
        open: true,
        success: true,
        message: "Your Incident Details were successfully updated"
      };
    case INCIDENT_DETAILS_UPDATE_FAILED:
      return {
        open: true,
        success: false,
        message:
          "Something went wrong on our end and your case was not updated. Please try again."
      };
    case CIVILIAN_CREATION_SUCCEEDED:
      return {
        open: true,
        success: true,
        message: "New Civilian was successfully added"
      };
    case CIVILIAN_CREATION_FAILED:
      return {
        open: true,
        success: false,
        message:
          "Something went wrong on our end and your civilian was not created. Please try again."
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
        message: "Complainant & Witnesses successfully updated"
      };
    case "EDIT_CIVILIAN_FAILED":
      return {
        open: true,
        success: false,
        message:
          "Something went wrong on our end and the civilian was not updated. Please try again."
      };
    case ATTACHMENT_UPLOAD_SUCCEEDED:
      return {
        open: true,
        success: true,
        message: "Your file was successfully attached"
      };
    case ATTACHMENT_UPLOAD_FAILED:
      return {
        open: true,
        success: false,
        message: "We could not attach your file. Please try again."
      };
    case REMOVE_ATTACHMENT_SUCCESS:
      return {
        open: true,
        success: true,
        message: "Your attachment was successfully removed"
      };
    case REMOVE_ATTACHMENT_FAILED:
      return {
        open: true,
        success: false,
        message: "We could not remove your attachment. Please try again."
      };
    case DOWNLOAD_FAILED:
      return {
        open: true,
        success: false,
        message: "We were unable to download the file. Please try again."
      };
    case ADD_OFFICER_TO_CASE_FAILED:
      return {
        open: true,
        success: false,
        message: "We could not add the officer to your case. Please try again."
      };
    case ADD_CASE_NOTE_SUCCEEDED:
      return {
        success: true,
        open: true,
        message: "Your action was successfully logged"
      };
    case ADD_CASE_NOTE_FAILED:
      return {
        success: false,
        open: true,
        message: "We could not log your action. Please try again."
      };
    case EDIT_CASE_NOTE_SUCCEEDED:
      return {
        success: true,
        open: true,
        message: "Case note successfully updated."
      };
    case EDIT_CASE_NOTE_FAILED:
      return {
        success: false,
        open: true,
        message:
          "Something went wrong on our end and the case note was not updated. Please try again."
      };
    case REMOVE_CASE_NOTE_SUCCEEDED:
      return {
        success: true,
        open: true,
        message: "Case note successfully removed."
      };
    case REMOVE_CASE_NOTE_FAILED:
      return {
        success: false,
        open: true,
        message:
          "Something went wrong on our end and the case note was not removed. Please try again."
      };
    case EDIT_CASE_OFFICER_SUCCEEDED:
      return {
        open: true,
        success: true,
        message: "Officer successfully updated"
      };
    case EDIT_CASE_OFFICER_FAILED:
      return {
        success: false,
        open: true,
        message:
          "Something went wrong on our end and the officer was not updated. Please try again."
      };
    case GET_ALLEGATIONS_FAILED:
      return {
        success: false,
        open: true,
        message:
          "There was a problem loading this page. Please refresh and try again."
      };
    default:
      return state;
  }
};
export default snackbarReducer;
