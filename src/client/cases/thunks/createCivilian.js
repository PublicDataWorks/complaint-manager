import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import {
    closeEditDialog,
    createCivilianFailure,
    createCivilianSuccess
} from "../../actionCreators/casesActionCreators";
import config from "../../config/config";

const hostname = config[process.env.NODE_ENV].hostname

const createCivilian = (civilian) => async (dispatch) => {

    try {
        const token = getAccessToken()

        if (!token) {
            dispatch(push(`/login`))
            return dispatch(createCivilianFailure())
        }

        const response = await fetch(`${hostname}/api/civilian`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(civilian)
        })

        switch (response.status) {
            case 201:
                const civilians = await response.json()
                dispatch(createCivilianSuccess(civilians))
                return dispatch(closeEditDialog())
            case 401:
                dispatch(push(`/login`))
                return dispatch(createCivilianFailure())
            default:
                return dispatch(createCivilianFailure())
        }

    } catch (e) {
        return dispatch(createCivilianFailure())
    }
}

export default createCivilian