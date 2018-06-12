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
  USER_ACTION_DIALOG_OPENED,
  USER_ACTION_DIALOG_CLOSED,
  ADD_USER_ACTION_FAILED,
  ADD_USER_ACTION_SUCCEEDED,
  REMOVE_CIVILIAN_DIALOG_OPENED,
  REMOVE_CIVILIAN_DIALOG_CLOSED,
  REMOVE_CIVILIAN_FAILED,
  REMOVE_CIVILIAN_SUCCEEDED,
  REMOVE_USER_ACTION_DIALOG_OPENED,
  REMOVE_USER_ACTION_DIALOG_CLOSED,
  REMOVE_USER_ACTION_SUCCEEDED,
  REMOVE_USER_ACTION_FAILED,
  EDIT_USER_ACTION_FAILED,
  EDIT_USER_ACTION_SUCCEEDED
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

export const openUserActionDialog = (dialogType, initialCaseNote) => ({
  type: USER_ACTION_DIALOG_OPENED,
  dialogType,
  initialCaseNote
});

export const closeUserActionDialog = () => ({
  type: USER_ACTION_DIALOG_CLOSED
});

export const openRemoveUserActionDialog = (activity = {}) => ({
  type: REMOVE_USER_ACTION_DIALOG_OPENED,
  activity
});

export const closeRemoveUserActionDialog = () => ({
  type: REMOVE_USER_ACTION_DIALOG_CLOSED
});

export const openCreateCaseDialog = () =>({
  type: CREATE_CASE_DIALOG_OPENED
})

export const closeCreateCaseDialog = () =>({
  type: CREATE_CASE_DIALOG_CLOSED
})

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

export const addUserActionFailure = () => ({
  type: ADD_USER_ACTION_FAILED
});

export const addUserActionSuccess = recentActivity => ({
  type: ADD_USER_ACTION_SUCCEEDED,
  recentActivity
});

export const editUserActionFailure = () => ({
  type: EDIT_USER_ACTION_FAILED
});

export const editUserActionSuccess = recentActivity => ({
  type: EDIT_USER_ACTION_SUCCEEDED,
  recentActivity
});

export const removeUserActionSuccess = currentCase => ({
  type: REMOVE_USER_ACTION_SUCCEEDED,
  caseDetails: currentCase.caseDetails,
  recentActivity: currentCase.recentActivity
});

export const removeUserActionFailure = () => ({
  type: REMOVE_USER_ACTION_FAILED
});

export const openRemoveCivilianDialog = civilianDetails => ({
  type: REMOVE_CIVILIAN_DIALOG_OPENED,
  civilianDetails
});

export const closeRemoveCivilianDialog = () => ({
  type: REMOVE_CIVILIAN_DIALOG_CLOSED
});

export const removeCivilianFailure = () => ({
  type: REMOVE_CIVILIAN_FAILED
});

export const removeCivilianSuccess = caseDetails => ({
  type: REMOVE_CIVILIAN_SUCCEEDED,
  caseDetails
});
