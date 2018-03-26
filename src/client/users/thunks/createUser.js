import {createUserFailure, createUserSuccess, requestUserCreation} from "../../actionCreators/usersActionCreators";
import getAccessToken from "../../auth/getAccessToken";
import {push} from "react-router-redux";

const testing = process.env.NODE_ENV === 'test'
const hostname = testing ? 'http://localhost' : ''

const createUser = (user) => async (dispatch) => {
    dispatch(requestUserCreation())

    try {
        const token = getAccessToken()

        if (!token) {
            dispatch(push('/login'))
            throw Error('No Token')
        }

        const response = await fetch(`${hostname}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(user)
        })

        switch (response.status) {
            case 201:
                const createdUser = await response.json()
                return dispatch(createUserSuccess(createdUser))
            case 401:
                dispatch(createUserFailure())
                return dispatch(push(`/login`))
            default:
                throw response.status
        }
    } catch (e) {
        dispatch(createUserFailure())
    }
}

export default createUser