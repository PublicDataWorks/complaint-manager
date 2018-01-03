export const createCaseSuccess = (caseDetails) => ({
  type: 'CASE_CREATED_SUCCESS',
  caseDetails
})

export const requestCaseCreation = () => ({
  type: 'CASE_CREATION_REQUESTED'
})

export const createCaseFailure = (error) => ({
    type: 'CASE_CREATION_FAILED',
    error
})

export const getCasesSuccess = (cases) => ({
    type: 'GET_CASES_SUCCESS',
    cases
})
