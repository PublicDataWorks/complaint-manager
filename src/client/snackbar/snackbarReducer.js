const snackbarReducer = (state = false, action) => {
    switch (action.type) {
        case 'OPEN_SNACKBAR':
            return true
        case 'CLOSE_SNACKBAR':
            return false
        case 'USER_CREATION_REQUESTED':
            return false
        case 'USER_CREATED_SUCCESS':
            return true
        case 'USER_CREATION_FAILED':
            return true
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
export default snackbarReducer