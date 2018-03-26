import {updateNarrativeFailure, updateNarrativeSuccess} from "../../actionCreators/casesActionCreators";
import getAccessToken from "../../auth/getAccessToken";
import {push} from "react-router-redux";
import config from '../../config/config'

const hostname = config[process.env.NODE_ENV].hostname

const updateNarrative = (updateDetails) => async (dispatch) => {

    try {
        const token = getAccessToken()

        if (!token) {
            dispatch(push(`/login`))
            throw Error('No Token')
        }

        const response = await fetch(`${hostname}/api/cases/${updateDetails.id}/narrative`, {
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