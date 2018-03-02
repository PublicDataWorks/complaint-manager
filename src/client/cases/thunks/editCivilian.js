import {push} from "react-router-redux";
import {closeEditDialog, editCivilianFailed, editCivilianSuccess} from "../actionCreators";
import getAccessToken from "../../auth/getAccessToken";
import config from '../../config/config'

const hostname = config[process.env.NODE_ENV].hostname

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
        //TODO Log error and notify support
        dispatch(editCivilianFailed())
    }
}

export default editCivilian