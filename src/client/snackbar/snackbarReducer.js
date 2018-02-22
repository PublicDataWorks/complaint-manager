//TODO Discuss separation of concerns.
// Refactoring 1:  Use 1 global snackbar, don't worry about collisions.  Have thunk dispatch generic success/failure/pending with parameterized messages.  Puts presentation logic in thunk.  wah wah
/*    case 'REQUESTED':
            return {
                open: false,
                success: false,
                message: <parameterized>
            }
        case 'SUCCESS':
            return {
                open: true,
                success: true,
                message: <parameterized>
            }
        case 'SERVER_ERROR':
            return {
                open: true,
                success: false,
                message: <parameterized>
            }
        default:
            return state
*/
// Refactoring 2:  Instantiate different snackbars for each type of business event so that one success event can't dismiss another failure's red snackbar.

const initialState = {open: false, success: false, message: ''}
const snackbarReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CLOSE_SNACKBAR':
            const newState = {open: false, success: state.success, message: state.message}
            return newState
        case 'USER_CREATION_REQUESTED':
            return {
                open: false,
                success: false,
                message: ''
            }
        case 'USER_CREATED_SUCCESS':
            return {
                open: true,
                success: true,
                message: 'User was successfully created.'
            }
        case 'USER_CREATION_FAILED':
            return {
                open: true,
                success: false,
                message: 'Something went wrong on our end and your user was not created. Please try again.'
            }
        case 'CASE_CREATION_REQUESTED':
            return {
                open: false,
                success: false,
                message: ''
            }
        case 'CASE_CREATED_SUCCESS':
            return {
                open: true,
                success: true,
                message: `Case ${action.caseDetails.id} was successfully created.`
            }
        case 'CASE_CREATION_FAILED':
            return {
                open: true,
                success: false,
                message: 'Something went wrong on our end and your case was not created. Please try again.'
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
        case 'EDIT_CIVILIAN_SUCCESS':
            return {
                open: true,
                success: true,
                message: 'Complainant & Witnesses successfully updated'
            }
        case 'EDIT_CIVILIAN_FAILED':
            return {
                open: true,
                success: false,
                message: 'Something went wrong on our end and Complainant & Witnesses was not updated. Please try again.'
            }
        default:
            return state
    }
}
export default snackbarReducer