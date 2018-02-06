import {updateNarrativeFailure, updateNarrativeSuccess} from "../actionCreators";
import getAccessToken from "../../auth/getAccessToken";
import {push} from "react-router-redux";

const testing = process.env.NODE_ENV === 'test'
const hostname = testing ? 'http://localhost' : ''

const updateNarrative = (updateDetails) => async (dispatch) => {

    try {
        const token = getAccessToken()

        if (!token) {
            dispatch(push(`/login`))
            throw Error('No Token')
        }

        const response = await fetch(`${hostname}/case/${updateDetails.id}/narrative`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({narrative: updateDetails.narrative})
        })

        switch (response.status) {
            case 200:
                const updatedCase = await response.json()
                return dispatch(updateNarrativeSuccess(updatedCase))
            case 401:
                dispatch(updateNarrativeFailure())
                return dispatch(push(`/login`))
            case 500:
                return dispatch(updateNarrativeFailure())
            default:
                throw response.status
        }
    }
    catch (e) {
        dispatch(updateNarrativeFailure())
    }
}

export default updateNarrative