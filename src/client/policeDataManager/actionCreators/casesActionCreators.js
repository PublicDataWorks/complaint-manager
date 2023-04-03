import {
  ADD_CASE_NOTE_SUCCEEDED,
  ADDRESS_DISPLAY_VALUE_UPDATED,
  ADDRESS_ERROR_MESSAGE_UPDATED,
  ADDRESS_MESSAGE_VISIBILITY_UPDATED,
  ADDRESS_TO_CONFIRM_UPDATED,
  ADDRESS_VALIDITY_UPDATED,
  ARCHIVE_CASE_DIALOG_CLOSED,
  ARCHIVE_CASE_DIALOG_OPENED,
  ARCHIVE_CASE_SUCCESS,
  ATTACHMENT_UPLOAD_SUCCEEDED,
  CASE_CREATED_SUCCESS,
  CASE_NOTE_DIALOG_CLOSED,
  CASE_NOTE_DIALOG_OPENED,
  CASE_STATUS_UPDATE_DIALOG_CLOSED,
  CASE_STATUS_UPDATE_DIALOG_OPENED,
  CASE_STATUS_UPDATE_DIALOG_SUBMITTING,
  CASE_TAG_DIALOG_CLOSED,
  CASE_TAG_DIALOG_OPENED,
  CIVILIAN_CREATION_SUCCEEDED,
  CIVILIAN_DIALOG_OPENED,
  CREATE_CASE_TAG_SUCCESS,
  EDIT_CASE_NOTE_SUCCEEDED,
  EDIT_CIVILIAN_DIALOG_CLOSED,
  EDIT_INCIDENT_DETAILS_DIALOG_CLOSED,
  EDIT_INCIDENT_DETAILS_DIALOG_OPENED,
  FETCHING_CASE_NOTES,
  FETCHING_CASE_TAGS,
  GET_ARCHIVED_CASES_SUCCESS,
  GET_CASE_DETAILS_SUCCESS,
  GET_CASE_NOTES_SUCCEEDED,
  GET_CASE_TAG_SUCCESS,
  GET_MINIMUM_CASE_DETAILS_SUCCESS,
  GET_WORKING_CASES_SUCCESS,
  INCIDENT_DETAILS_UPDATE_SUCCEEDED,
  OFFICER_TITLE,
  REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_CLOSED,
  REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_EXITED,
  REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_OPENED,
  REMOVE_CASE_NOTE_DIALOG_CLOSED,
  REMOVE_CASE_NOTE_DIALOG_OPENED,
  REMOVE_CASE_NOTE_SUCCEEDED,
  REMOVE_CASE_TAG_DIALOG_CLOSED,
  REMOVE_CASE_TAG_DIALOG_OPENED,
  REMOVE_CASE_TAG_SUCCESS,
  REMOVE_PERSON_DIALOG_CLOSED,
  REMOVE_PERSON_DIALOG_OPENED,
  REMOVE_PERSON_SUCCEEDED,
  RESET_ARCHIVED_CASES_LOADED,
  RESET_ARCHIVED_CASES_PAGING,
  RESET_WORKING_CASES_LOADED,
  RESET_WORKING_CASES_PAGING,
  RESTORE_ARCHIVED_CASE_DIALOG_CLOSED,
  RESTORE_ARCHIVED_CASE_DIALOG_OPENED,
  UPDATE_ALLEGATION_DETAILS_SUCCEEDED,
  UPDATE_CASE_STATUS_SUCCESS,
  UPDATE_CASES_TABLE_SORTING
} from "../../../sharedUtilities/constants";
import _ from "lodash";

const {
  DEFAULT_PERSON_TYPE,
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

export const createCaseSuccess = caseDetails => ({
  type: CASE_CREATED_SUCCESS,
  caseDetails
});

export const getWorkingCasesSuccess = (cases, totalCaseCount, page) => ({
  type: GET_WORKING_CASES_SUCCESS,
  cases,
  totalCaseCount,
  page
});

export const resetWorkingCasesLoaded = () => ({
  type: RESET_WORKING_CASES_LOADED
});

export const resetWorkingCasesPaging = () => ({
  type: RESET_WORKING_CASES_PAGING
});

export const getArchivedCasesSuccess = (cases, totalCaseCount, page) => ({
  type: GET_ARCHIVED_CASES_SUCCESS,
  cases,
  totalCaseCount,
  page
});

export const resetArchivedCasesLoaded = () => ({
  type: RESET_ARCHIVED_CASES_LOADED
});

export const resetArchivedCasesPaging = () => ({
  type: RESET_ARCHIVED_CASES_PAGING
});

export const getCaseDetailsSuccess = caseDetails => ({
  type: GET_CASE_DETAILS_SUCCESS,
  caseDetails
});

export const archiveCaseSuccess = () => ({
  type: ARCHIVE_CASE_SUCCESS
});

export const getMinimumCaseDetailsSuccess = caseDetails => ({
  type: GET_MINIMUM_CASE_DETAILS_SUCCESS,
  caseDetails
});

export const getCaseNotesSuccess = caseNotes => ({
  type: GET_CASE_NOTES_SUCCEEDED,
  caseNotes
});

export const updateSort = (sortBy, sortDirection, caseType) => {
  return {
    type: UPDATE_CASES_TABLE_SORTING,
    caseType,
    sortBy,
    sortDirection
  };
};

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

export const openCaseTagDialog = () => ({
  type: CASE_TAG_DIALOG_OPENED
});

export const closeCaseTagDialog = () => ({
  type: CASE_TAG_DIALOG_CLOSED
});

export const createCaseTagSuccess = caseTags => ({
  type: CREATE_CASE_TAG_SUCCESS,
  caseTags
});

export const removeCaseTagSuccess = caseTags => ({
  type: REMOVE_CASE_TAG_SUCCESS,
  caseTags
});

export const getCaseTagSuccess = caseTags => ({
  type: GET_CASE_TAG_SUCCESS,
  caseTags
});

export const fetchingCaseTags = fetching => ({
  type: FETCHING_CASE_TAGS,
  fetching
});

export const fetchingCaseNotes = fetching => ({
  type: FETCHING_CASE_NOTES,
  fetching
});

export const openRemoveCaseTagDialog = (caseTag = {}) => ({
  type: REMOVE_CASE_TAG_DIALOG_OPENED,
  caseTag
});

export const closeRemoveCaseTagDialog = () => ({
  type: REMOVE_CASE_TAG_DIALOG_CLOSED
});

export const openRemoveAttachmentConfirmationDialog = attachmentFileName => ({
  type: REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_OPENED,
  attachmentFileName
});

export const closeRemoveAttachmentConfirmationDialog = () => ({
  type: REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_CLOSED
});

export const exitedRemoveAttachmentConfirmationDialog = () => ({
  type: REMOVE_ATTACHMENT_CONFIRMATION_DIALOG_EXITED
});

export const openCivilianDialog = (title, submitButtonText, submitAction) => ({
  type: CIVILIAN_DIALOG_OPENED,
  title,
  submitButtonText,
  submitAction
});

export const closeEditCivilianDialog = () => {
  return {
    type: EDIT_CIVILIAN_DIALOG_CLOSED
  };
};

export const createCivilianSuccess = caseDetails => ({
  type: CIVILIAN_CREATION_SUCCEEDED,
  caseDetails
});

export const editCivilianSuccess = caseDetails => ({
  type: "EDIT_CIVILIAN_SUCCESS",
  caseDetails
});

export const uploadAttachmentSuccess = caseDetails => ({
  type: ATTACHMENT_UPLOAD_SUCCEEDED,
  caseDetails
});

export const updateCaseStatusSuccess = caseDetails => ({
  type: UPDATE_CASE_STATUS_SUCCESS,
  caseDetails
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

export const addCaseNoteSuccess = (caseDetails, caseNotes) => ({
  type: ADD_CASE_NOTE_SUCCEEDED,
  caseDetails,
  caseNotes
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

export const updateAllegationDetailsSuccess = (allegationId, caseDetails) => ({
  type: UPDATE_ALLEGATION_DETAILS_SUCCEEDED,
  allegationId,
  caseDetails
});

export const removePersonSuccess = caseDetails => ({
  type: REMOVE_PERSON_SUCCEEDED,
  caseDetails
});

export const openCaseStatusUpdateDialog = (nextStatus, redirectUrl = null) => ({
  type: CASE_STATUS_UPDATE_DIALOG_OPENED,
  redirectUrl: redirectUrl,
  nextStatus: nextStatus
});

export const submitCaseStatusUpdateDialog = () => ({
  type: CASE_STATUS_UPDATE_DIALOG_SUBMITTING
});

export const closeCaseStatusUpdateDialog = () => ({
  type: CASE_STATUS_UPDATE_DIALOG_CLOSED
});

export const openArchiveCaseDialog = () => ({
  type: ARCHIVE_CASE_DIALOG_OPENED
});

export const closeArchiveCaseDialog = () => ({
  type: ARCHIVE_CASE_DIALOG_CLOSED
});

export const openEditIncidentDetailsDialog = () => ({
  type: EDIT_INCIDENT_DETAILS_DIALOG_OPENED
});

export const closeEditIncidentDetailsDialog = () => ({
  type: EDIT_INCIDENT_DETAILS_DIALOG_CLOSED
});

export const openRestoreArchivedCaseDialog = () => ({
  type: RESTORE_ARCHIVED_CASE_DIALOG_OPENED
});

export const closeRestoreArchivedCaseDialog = () => ({
  type: RESTORE_ARCHIVED_CASE_DIALOG_CLOSED
});
