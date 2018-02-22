import {push} from "react-router-redux";
import {closeEditDialog, editCivilianFailed, editCivilianSuccess} from "../actionCreators";
import {reset} from "redux-form";
import getAccessToken from "../../auth/getAccessToken";

const testing = process.env.NODE_ENV === 'test'
const hostname = testing ? 'http://localhost' : ''

const editCivilian = (civilian) => async (dispatch) => {
    try {
        const token = getAccessToken()

        if (!token) {
            dispatch(push(`/login`))
            throw Error('No Token')
        }

        const response = await fetch(`${hostname}/civilian/${civilian.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(civilian)
        })

        switch (response.status) {
            //TODO add test for happy path

            case 200:
                const parsedCivilian = await response.json()
                dispatch(editCivilianSuccess(parsedCivilian))
                return dispatch(closeEditDialog())
            case 401:
                return dispatch(push(`/login`))
            default:
                throw response.status
        }
    } catch (e) {
        dispatch(editCivilianFailed())
    }
}

export default editCivilian