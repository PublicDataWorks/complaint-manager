const caseSnackbarReducer = (state = false, action) => {
    switch (action.type) {
        case 'OPEN_CASE_SNACKBAR': // for debugging
            return true
        case 'CLOSE_CASE_SNACKBAR':
            return false
        case 'CASE_CREATION_REQUESTED':
            return false
        case 'CASE_CREATED_SUCCESS':
            return true
        case 'CASE_CREATION_FAILED':
            return true
        default:
            return state
    }
}
export default caseSnackbarReducer