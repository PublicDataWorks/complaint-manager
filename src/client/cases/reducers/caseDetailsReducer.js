const initialState = {
    success: false,
    message: ''
}
const caseDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'CASE_CREATED_SUCCESS':
            return {
                success: true,
                message: `Case ${action.caseDetails.id} was successfully created.`
            }
        case 'NARRATIVE_UPDATE_SUCCEEDED':
            return {
                success: true,
                message: 'Your narrative was successfully updated'
            }
        case 'NARRATIVE_UPDATE_FAILED':
            return {
                success: false,
                message: 'Something went wrong on our end and your case was not updated. Please try again.'
            }
        default:
            return state
    }
}

export default caseDetailsReducer