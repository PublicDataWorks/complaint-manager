const userSnackbarReducer = (state = false, action) => {
    switch (action.type) {
        case 'OPEN_USER_SNACKBAR':
            return true
        case 'CLOSE_USER_SNACKBAR':
            return false
        case 'USER_CREATION_REQUESTED':
            return false
        case 'USER_CREATED_SUCCESS':
            return true
        case 'USER_CREATION_FAILED':
            return true
        default:
            return state
    }
}
export default userSnackbarReducer