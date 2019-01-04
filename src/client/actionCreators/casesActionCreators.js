import * as _ from "lodash";
import {
  ADD_CASE_NOTE_FAILED,
  ADD_CASE_NOTE_SUCCEEDED,
  ADDRESS_DISPLAY_VALUE_UPDATED,
  ADDRESS_ERROR_MESSAGE_UPDATED,
  ADDRESS_MESSAGE_VISIBILITY_UPDATED,
  ADDRESS_TO_CONFIRM_UPDATED,
  ADDRESS_VALIDITY_UPDATED,
  ATTACHMENT_UPLOAD_FAILED,
  CASE_CREATED_SUCCESS,
  CASE_NOTE_DIALOG_CLOSED,
  CASE_NOTE_DIALOG_OPENED,
  CASE_STATUS_UPDATE_DIALOG_CLOSED,
  CASE_STATUS_UPDATE_DIALOG_OPENED,
  CASE_VALIDATION_DIALOG_CLOSED,
  CASE_VALIDATION_DIALOG_OPENED,
  CIVILIAN_CREATION_FAILED,
  CIVILIAN_CREATION_SUCCEEDED,
  CIVILIAN_DIALOG_OPENED,
  CREATE_CASE_DIALOG_CLOSED,
  CREATE_CASE_DIALOG_OPENED,
  EDIT_CASE_NOTE_FAILED,
  EDIT_CASE_NOTE_SUCCEEDED,
  GET_CASE_DETAILS_SUCCESS,
  GET_CASE_NOTES_SUCCEEDED,
  GET_CASE_NUMBER_SUCCESS,
  INCIDENT_DETAILS_UPDATE_FAILED,
  INCIDENT_DETAILS_UPDATE_SUCCEEDED,
  REMOVE_CASE_NOTE_DIALOG_CLOSED,
  REMOVE_CASE_NOTE_DIALOG_OPENED,
  REMOVE_CASE_NOTE_FAILED,
  REMOVE_CASE_NOTE_SUCCEEDED,
  REMOVE_PERSON_DIALOG_CLOSED,
  REMOVE_PERSON_DIALOG_OPENED,
  REMOVE_PERSON_FAILED,
  REMOVE_PERSON_SUCCEEDED,
  UPDATE_ALLEGATION_DETAILS_SUCCEEDED,
  UPDATE_CASE_STATUS_SUCCESS
} from "../../sharedUtilities/constants";

export const createCaseSuccess = caseDetails => ({
  type: CASE_CREATED_SUCCESS,
  caseDetails
});

export const requestCaseCreation = () => ({
  type: "CASE_CREATION_REQUESTED"
});

export const createCaseFailure = () => ({
  type: "CASE_CREATION_FAILED"
});

export const getCasesSuccess = data => ({
  type: "GET_CASES_SUCCESS",
  data
});

export const getCaseDetailsSuccess = caseDetails => ({
  type: GET_CASE_DETAILS_SUCCESS,
  caseDetails
});

export const getCaseNumberSuccess = caseDetails => ({
  type: GET_CASE_NUMBER_SUCCESS,
  caseDetails
});

export const getCaseNotesSuccess = caseNotes => ({
  type: GET_CASE_NOTES_SUCCEEDED,
  caseNotes
});
export const updateNarrativeSuccess = caseDetails => ({
  type: "NARRATIVE_UPDATE_SUCCEEDED",
  caseDetails
});

export const updateNarrativeFailure = () => ({
  type: "NARRATIVE_UPDATE_FAILED"
});

export const updateSort = sortBy => ({
  type: "SORT_UPDATED",
  sortBy
});

export const updatePage = page => ({
  type: "PAGE_UPDATED",
  page
});

export const openCaseNoteDialog = (dialogType, initialCaseNote) => ({
  type: CASE_NOTE_DIALOG_OPENED,
  dialogType,
  initialCaseNote
});

export const closeCaseNoteDialog = () => ({
  type: CASE_NOTE_DIALOG_CLOSED
});

export const openRemoveCaseNoteDialog = (activity = {}) => ({
  type: REMOVE_CASE_NOTE_DIALOG_OPENED,
  activity
});

export const closeRemoveCaseNoteDialog = () => ({
  type: REMOVE_CASE_NOTE_DIALOG_CLOSED
});

export const openCreateCaseDialog = () => ({
  type: CREATE_CASE_DIALOG_OPENED
});

export const closeCreateCaseDialog = () => ({
  type: CREATE_CASE_DIALOG_CLOSED
});

export const openCivilianDialog = (title, submitButtonText, submitAction) => ({
  type: CIVILIAN_DIALOG_OPENED,
  title,
  submitButtonText,
  submitAction
});

export const closeEditDialog = () => ({
  type: "EDIT_DIALOG_CLOSED"
});

export const createCivilianSuccess = caseDetails => ({
  type: CIVILIAN_CREATION_SUCCEEDED,
  caseDetails
});

export const createCivilianFailure = () => ({
  type: CIVILIAN_CREATION_FAILED
});

export const editCivilianSuccess = caseDetails => ({
  type: "EDIT_CIVILIAN_SUCCESS",
  caseDetails
});

export const editCivilianFailed = () => ({
  type: "EDIT_CIVILIAN_FAILED"
});

export const uploadAttachmentSuccess = caseDetails => ({
  type: "ATTACHMENT_UPLOAD_SUCCEEDED",
  caseDetails
});

export const updateCaseStatusSuccess = caseDetails => ({
  type: UPDATE_CASE_STATUS_SUCCESS,
  caseDetails
});

export const uploadAttachmentFailed = () => ({
  type: ATTACHMENT_UPLOAD_FAILED
});

export const updateIncidentDetailsSuccess = caseDetails => ({
  type: INCIDENT_DETAILS_UPDATE_SUCCEEDED,
  caseDetails
});

export const updateAddressInputValidity = addressValid => ({
  type: ADDRESS_VALIDITY_UPDATED,
  addressValid
});

export const updateShowAddressMessage = addressMessageVisible => ({
  type: ADDRESS_MESSAGE_VISIBILITY_UPDATED,
  addressMessageVisible
});

export const updateAddressToConfirm = addressToConfirm => ({
  type: ADDRESS_TO_CONFIRM_UPDATED,
  addressToConfirm
});

export const updateAddressDisplayValue = addressDisplayValue => ({
  type: ADDRESS_DISPLAY_VALUE_UPDATED,
  addressDisplayValue
});

export const updateAddressErrorMessage = addressErrorMessage => ({
  type: ADDRESS_ERROR_MESSAGE_UPDATED,
  addressErrorMessage
});

export const updateIncidentDetailsFailure = () => ({
  type: INCIDENT_DETAILS_UPDATE_FAILED
});

export const addCaseNoteFailure = () => ({
  type: ADD_CASE_NOTE_FAILED
});

export const addCaseNoteSuccess = (caseDetails, caseNotes) => ({
  type: ADD_CASE_NOTE_SUCCEEDED,
  caseDetails,
  caseNotes
});

export const editCaseNoteFailure = () => ({
  type: EDIT_CASE_NOTE_FAILED
});

export const editCaseNoteSuccess = caseNotes => ({
  type: EDIT_CASE_NOTE_SUCCEEDED,
  caseNotes
});

export const removeCaseNoteSuccess = currentCase => ({
  type: REMOVE_CASE_NOTE_SUCCEEDED,
  caseDetails: currentCase.caseDetails,
  caseNotes: currentCase.caseNotes
});

export const removeCaseNoteFailure = () => ({
  type: REMOVE_CASE_NOTE_FAILED
});

export const updateAllegationDetailsSuccess = (allegationId, caseDetails) => ({
  type: UPDATE_ALLEGATION_DETAILS_SUCCEEDED,
  allegationId,
  caseDetails
});

export const openRemovePersonDialog = (personDetails, personType) => {
  let optionalText, personTypeTitleDisplay;

  if (personType === "civilians") {
    optionalText = "";
    personTypeTitleDisplay = "Civilian";
  } else {
    optionalText =
      " This includes any Notes or Allegations associated to the officer.";
    personTypeTitleDisplay = "Officer";
  }

  return {
    type: REMOVE_PERSON_DIALOG_OPENED,
    personDetails: { ...personDetails, personType: personType },
    optionalText,
    personTypeTitleDisplay
  };
};

export const closeRemovePersonDialog = () => ({
  type: REMOVE_PERSON_DIALOG_CLOSED
});

export const removePersonFailure = personType => ({
  type: REMOVE_PERSON_FAILED,
  message: `Something went wrong and the ${_.lowerCase(
    personType
  )} was not removed. Please try again.`
});

export const removePersonSuccess = (caseDetails, personType) => ({
  type: REMOVE_PERSON_SUCCEEDED,
  caseDetails,
  message: `${_.startCase(personType)} was successfully removed`
});

export const openCaseStatusUpdateDialog = redirectUrl => ({
  type: CASE_STATUS_UPDATE_DIALOG_OPENED,
  redirectUrl: redirectUrl
});

export const closeCaseStatusUpdateDialog = () => ({
  type: CASE_STATUS_UPDATE_DIALOG_CLOSED
});

export const openCaseValidationDialog = errors => ({
  type: CASE_VALIDATION_DIALOG_OPENED,
  errors
});

export const closeCaseValidationDialog = () => ({
  type: CASE_VALIDATION_DIALOG_CLOSED
});
