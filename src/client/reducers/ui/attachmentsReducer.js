const initialState = {
    errorMessage: ''
}

const attachmentsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INVALID_FILE_TYPE_DROPPED':
            return {
                errorMessage: 'File type not supported.'
            }
        case 'DUPLICATE_FILE_DROPPED':
            return {
                errorMessage: 'File name already exists'
            }
        case 'DROPZONE_FILE_REMOVED':
            return {
                errorMessage: ''
            }
        default:
            return state
    }
}

export default attachmentsReducer