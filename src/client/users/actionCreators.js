export const createUserSuccess = (user) => ({
    type: 'USER_CREATED_SUCCESS',
    user
})

export const requestUserCreation = () => ({
    type: 'USER_CREATION_REQUESTED'
})

export const createUserFailure = () => ({
    type: 'USER_CREATION_FAILED'
})

export const getUsersSuccess = (users) => ({
    type: 'GET_USERS_SUCCESS',
    users
})

export const openUserSnackbar = () =>{
    return {
        type: "OPEN_USER_SNACKBAR"
    }
}

export const closeUserSnackbar = () =>{
    return {
        type: "CLOSE_USER_SNACKBAR"
    }
}