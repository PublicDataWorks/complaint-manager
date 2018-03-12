const initialState = {
    invalidFileMessageVisible: false
}

const attachmentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INVALID_FILE_TYPE_DROPPED':
            return {
                invalidFileMessageVisible: true
            }
        case 'DROPZONE_FILE_REMOVED':
            return {
                invalidFileMessageVisible: false
            }
        default:
            return state
    }
}

export default attachmentsReducer