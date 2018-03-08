const initialState = {
    invalidFileMessageVisible: false
}

const attachmentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FILE_TYPE_INVALID':
            return {
                invalidFileMessageVisible: true
            }
        case 'INVALID_FILE_TYPE_REMOVED':
            return {
                invalidFileMessageVisible: false
            }
        default:
            return state
    }
}

export default attachmentsReducer