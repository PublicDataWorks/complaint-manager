import {
    CASE_CREATED_SUCCESS,
    ATTACHMENT_UPLOAD_FAILED,
    CIVILIAN_DIALOG_OPENED,
    CIVILIAN_CREATION_SUCCEEDED,
    CIVILIAN_CREATION_FAILED,
    INCIDENT_DETAILS_UPDATE_SUCCEEDED,
    INCIDENT_DETAILS_UPDATE_FAILED, CIVILIAN_ADDRESS_AUTOSUGGEST_UPDATED, INCIDENT_LOCATION_AUTOSUGGEST_VALUE_UPDATED,
} from "../../sharedUtilities/constants";

export const createCaseSuccess = (caseDetails) => ({
    type: CASE_CREATED_SUCCESS,
    caseDetails
})

export const requestCaseCreation = () => ({
    type: 'CASE_CREATION_REQUESTED'
})

export const createCaseFailure = () => ({
    type: 'CASE_CREATION_FAILED'
})

export const getCasesSuccess = (cases) => ({
    type: 'GET_CASES_SUCCESS',
    cases
})

export const getCaseDetailsSuccess = (caseDetails) => ({
    type: 'GET_CASE_DETAILS_SUCCESS',
    caseDetails
})

export const updateNarrativeSuccess = (caseDetails) => ({
    type: 'NARRATIVE_UPDATE_SUCCEEDED',
    caseDetails
})

export const updateNarrativeFailure = () => ({
    type: 'NARRATIVE_UPDATE_FAILED'
})

export const updateSort = (sortBy) => ({
    type: 'SORT_UPDATED',
    sortBy
})

export const openCivilianDialog = (title, submitButtonText, submitAction) => ({
    type: CIVILIAN_DIALOG_OPENED,
    title,
    submitButtonText,
    submitAction
})

export const closeEditDialog = () => ({
    type: 'EDIT_DIALOG_CLOSED'
})

export const createCivilianSuccess = (civilians) => ({
    type: CIVILIAN_CREATION_SUCCEEDED,
    civilians
})

export const createCivilianFailure = () => ({
    type: CIVILIAN_CREATION_FAILED
})

export const editCivilianSuccess = (civilians) => ({
    type: 'EDIT_CIVILIAN_SUCCESS',
    civilians
})

export const editCivilianFailed = () => ({
    type: 'EDIT_CIVILIAN_FAILED',
})

export const uploadAttachmentSuccess = (caseDetails) => ({
    type: 'ATTACHMENT_UPLOAD_SUCCEEDED',
    caseDetails
})

export const uploadAttachmentFailed = () => ({
    type: ATTACHMENT_UPLOAD_FAILED,
})

export const updateIncidentDetailsSuccess = (caseDetails) => ({
    type: INCIDENT_DETAILS_UPDATE_SUCCEEDED,
    caseDetails
})

export const updateIncidentLocationAutoSuggest = (autoSuggestValue) => ({
    type: INCIDENT_LOCATION_AUTOSUGGEST_VALUE_UPDATED,
        autoSuggestValue
})

export const updateIncidentDetailsFailure = () => ({
    type: INCIDENT_DETAILS_UPDATE_FAILED
})

export const updateAddressAutoSuggest = (addressValue) => ({
    type: CIVILIAN_ADDRESS_AUTOSUGGEST_UPDATED,
    addressValue
})