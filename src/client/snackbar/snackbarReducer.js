const initialState = {open: false}
const snackbarReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'OPEN_SNACKBAR':
            return {
                open: true
            }
        case 'CLOSE_SNACKBAR':
            return {
                open: false
            }
        case 'USER_CREATION_REQUESTED':
            return {
                open: false
            }
        case 'USER_CREATED_SUCCESS':
            return {
                open: true
            }
        case 'USER_CREATION_FAILED':
            return {
                open: true
            }
        case 'CASE_CREATION_REQUESTED':
            return {
                open: false
            }
        case 'CASE_CREATED_SUCCESS':
            return {
                open: true
            }
        case 'CASE_CREATION_FAILED':
            return {
                open: true
            }
        case 'UPDATE_NARRATIVE_SUCCESS':
            return {
                open: true
            }
        default:
            return state
    }
}
export default snackbarReducer