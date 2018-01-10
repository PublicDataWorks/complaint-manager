const initialState = {
    inProgress: false,
    success: false,
}

const userCreationReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'USER_CREATION_REQUESTED':
            return {
                inProgress: true,
                success: false,
            }
        case 'USER_CREATED_SUCCESS':
            return {
                inProgress: false,
                success: true,
            }
        default:
            return state;
    }
}

export default userCreationReducer