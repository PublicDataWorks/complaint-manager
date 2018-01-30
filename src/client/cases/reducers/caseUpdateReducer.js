const initialState = {
    success: false,
    message: ''
}
const caseUpdateReducer = (state = initialState, action) => {
    switch (action.type) {
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

export default caseUpdateReducer