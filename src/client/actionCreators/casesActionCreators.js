import * as _ from "lodash";
import {
  CASE_CREATED_SUCCESS,
  ATTACHMENT_UPLOAD_FAILED,
  CREATE_CASE_DIALOG_OPENED,
  CREATE_CASE_DIALOG_CLOSED,
  CIVILIAN_DIALOG_OPENED,
  CIVILIAN_CREATION_SUCCEEDED,
  CIVILIAN_CREATION_FAILED,
  INCIDENT_DETAILS_UPDATE_SUCCEEDED,
  INCIDENT_DETAILS_UPDATE_FAILED,
  CIVILIAN_ADDRESS_AUTOSUGGEST_UPDATED,
  INCIDENT_LOCATION_AUTOSUGGEST_VALUE_UPDATED,
  GET_RECENT_ACTIVITY_SUCCEEDED,
  CASE_NOTE_DIALOG_OPENED,
  CASE_NOTE_DIALOG_CLOSED,
  ADD_CASE_NOTE_FAILED,
  ADD_CASE_NOTE_SUCCEEDED,
  REMOVE_PERSON_DIALOG_OPENED,
  REMOVE_PERSON_DIALOG_CLOSED,
  REMOVE_PERSON_FAILED,
  REMOVE_PERSON_SUCCEEDED,
  REMOVE_CASE_NOTE_DIALOG_OPENED,
  REMOVE_CASE_NOTE_DIALOG_CLOSED,
  REMOVE_CASE_NOTE_SUCCEEDED,
  REMOVE_CASE_NOTE_FAILED,
  EDIT_CASE_NOTE_FAILED,
  EDIT_CASE_NOTE_SUCCEEDED,
  UPDATE_CASE_STATUS_SUCCESS,
  CASE_STATUS_UPDATE_DIALOG_OPENED,
  CASE_STATUS_UPDATE_DIALOG_CLOSED,
  UPDATE_ALLEGATION_DETAILS_SUCCEEDED
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

export const getCasesSuccess = cases => ({
  type: "GET_CASES_SUCCESS",
  cases
});

export const getCaseDetailsSuccess = caseDetails => ({
  type: "GET_CASE_DETAILS_SUCCESS",
  caseDetails
});

export const getRecentActivitySuccess = recentActivity => ({
  type: GET_RECENT_ACTIVITY_SUCCEEDED,
  recentActivity
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

export const updateIncidentLocationAutoSuggest = autoSuggestValue => ({
  type: INCIDENT_LOCATION_AUTOSUGGEST_VALUE_UPDATED,
  autoSuggestValue
});

export const updateIncidentDetailsFailure = () => ({
  type: INCIDENT_DETAILS_UPDATE_FAILED
});

export const updateAddressAutoSuggest = addressValue => ({
  type: CIVILIAN_ADDRESS_AUTOSUGGEST_UPDATED,
  addressValue
});

export const addCaseNoteFailure = () => ({
  type: ADD_CASE_NOTE_FAILED
});

export const addCaseNoteSuccess = recentActivity => ({
  type: ADD_CASE_NOTE_SUCCEEDED,
  recentActivity
});

export const editCaseNoteFailure = () => ({
  type: EDIT_CASE_NOTE_FAILED
});

export const editCaseNoteSuccess = recentActivity => ({
  type: EDIT_CASE_NOTE_SUCCEEDED,
  recentActivity
});

export const removeCaseNoteSuccess = currentCase => ({
  type: REMOVE_CASE_NOTE_SUCCEEDED,
  caseDetails: currentCase.caseDetails,
  recentActivity: currentCase.recentActivity
});

export const removeCaseNoteFailure = () => ({
  type: REMOVE_CASE_NOTE_FAILED
});

export const updateAllegationDetailsSuccess = caseDetails => ({
  type: UPDATE_ALLEGATION_DETAILS_SUCCEEDED,
  caseDetails
})

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
  message: `Something went wrong on our end and your ${_.lowerCase(
    personType
  )} was not removed. Please try again.`
});

export const removePersonSuccess = (caseDetails, personType) => ({
  type: REMOVE_PERSON_SUCCEEDED,
  caseDetails,
  message: `${_.startCase(personType)} has been successfully removed.`
});

export const openCaseStatusUpdateDialog = nextStatus => ({
  type: CASE_STATUS_UPDATE_DIALOG_OPENED,
  nextStatus
});

export const closeCaseStatusUpdateDialog = () => ({
  type: CASE_STATUS_UPDATE_DIALOG_CLOSED
});
