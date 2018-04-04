const initialState = {
    userInfo: {
        nickname: "",
        permissions: []
    }
}

const userInfoReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'AUTH_SUCCESS':
            return {userInfo: action.userInfo}
        default:
            return state
    }
}

export default userInfoReducer