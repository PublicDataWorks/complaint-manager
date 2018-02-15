export const createCaseSuccess = (caseDetails) => ({
  type: 'CASE_CREATED_SUCCESS',
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

export const openEditDialog = () => ({
    type: 'EDIT_DIALOG_OPENED'
})

export const closeEditDialog = () => ({
    type: 'EDIT_DIALOG_CLOSED'
})