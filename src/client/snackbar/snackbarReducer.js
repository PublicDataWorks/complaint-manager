const initialState = {open: false, success: false, message: ''}
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
                open: true,
                success: true,
                message: `Case ${action.caseDetails.id} was successfully created.`
            }
        case 'CASE_CREATION_FAILED':
            return {
                open: true
            }
        case 'NARRATIVE_UPDATE_SUCCEEDED':
            return {
                open: true,
                success: true,
                message: 'Your narrative was successfully updated'
            }
        case 'NARRATIVE_UPDATE_FAILED':
            return {
                open: true,
                success: false,
                message: 'Something went wrong on our end and your case was not updated. Please try again.'
            }
        default:
            return state
    }
}
export default snackbarReducer