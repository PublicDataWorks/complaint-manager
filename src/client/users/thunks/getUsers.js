import {getUsersSuccess} from "../../actionCreators/usersActionCreators";
import getAccessToken from "../../auth/getAccessToken";
import {push} from "react-router-redux";

const testing = process.env.NODE_ENV === 'test'
const hostname = testing ? 'http://localhost' : ''

const getUsers = () => async (dispatch) => {
    try {
        const token = getAccessToken()

        if (!token) {
            dispatch(push('/login'))
            throw new Error('No access token found');
        }

        const response = await fetch(`${hostname}/api/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        switch (response.status) {
            case 200:
                const responseBody = await response.json()
                return dispatch(getUsersSuccess(responseBody.users))
            case 401:
                return dispatch(push(`/login`))
            default:
                throw response.status
        }
    } catch (e) {
    }
}

export default getUsers