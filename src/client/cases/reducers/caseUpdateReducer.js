const initialState = {
    success: false,
    message: ''
}
const caseUpdateReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'UPDATE_NARRATIVE_SUCCESS':
            return {
                success: true,
                message: 'Your narrative was successfully updated'
            }
        default:
            return state
    }
}

export default caseUpdateReducer