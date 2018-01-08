import {getUsersSuccess} from "../actionCreators";

const testing = process.env.NODE_ENV === 'test'
const hostname = testing ? 'http://localhost' : ''

const getUsers = () => async (dispatch) => {
    const response = await fetch(`${hostname}/users`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const responseBody = await response.json()

    dispatch(getUsersSuccess(responseBody.users))
}

export default getUsers