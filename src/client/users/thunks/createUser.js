import {createUserFailure, createUserSuccess} from "../actionCreators";
const testing = process.env.NODE_ENV === 'test'
const hostname = testing ? 'http://localhost' : ''

const createUser = (user) => async (dispatch) => {

    try {
        const response = await fetch(`${hostname}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        if (response.status < 200 || response.status > 299) throw new Error()

        const responseBody = await response.json()

        dispatch(createUserSuccess(responseBody))
    } catch (e) {
        dispatch(createUserFailure())
    }
}

export default createUser