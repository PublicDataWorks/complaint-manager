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

export const redirectToCaseDetail = () => ({
    type: 'REDIRECT_TO_CASE_DETAIL'
})

export const clearRedirectToCaseDetail = () => ({
    type: 'CLEAR_REDIRECT_TO_CASE_DETAIL'
})

export const openCaseSnackbar = () =>{
    return {
        type: "OPEN_CASE_SNACKBAR"
    }
}

export const closeCaseSnackbar = () =>{
    return {
        type: "CLOSE_CASE_SNACKBAR"
    }
}