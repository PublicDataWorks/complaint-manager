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

export const updateNarrativeSuccess = (caseDetails) => ({
    type: 'NARRATIVE_UPDATE_SUCCEEDED',
    caseDetails
})

export const updateNarrativeFailure = () => ({
    type: 'NARRATIVE_UPDATE_FAILED'
})