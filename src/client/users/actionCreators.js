export const createUserSuccess = (user) => ({
    type: 'CREATE_USER_SUCCESS',
    user
})

export const createUserFailure = () => ({
    type: 'CREATE_USER_FAILURE'
})

export const getUsersSuccess = (users) => ({
    type: 'GET_USERS_SUCCESS',
    users
})