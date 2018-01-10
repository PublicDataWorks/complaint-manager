const initialState = {
    inProgress: false,
    success: false,
    message: ''
}

const userCreationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_CREATION_REQUESTED':
            return {
                inProgress: true,
                success: false,
                message: ''
            }
        case 'USER_CREATED_SUCCESS':
            return {
                inProgress: false,
                success: true,
                message: 'User was successfully created.'
            }
        case 'USER_CREATION_FAILED':
            return {
                inProgress: false,
                success: false,
                message: 'Something went wrong on our end and your user was not created. Please try again.'
            }
        default:
            return state;
    }
}

export default userCreationReducer