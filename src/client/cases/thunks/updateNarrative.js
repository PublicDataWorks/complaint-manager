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
            return dispatch(updateNarrativeFailure())
        }

        const response = await fetch(`${hostname}/api/cases/${updateDetails.id}/narrative`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                narrativeSummary: updateDetails.narrativeSummary,
                narrativeDetails: updateDetails.narrativeDetails,
            })
        })

        switch (response.status) {
            case 200:
                const updatedCase = await response.json()
                return dispatch(updateNarrativeSuccess(updatedCase))
            case 401:
                dispatch(push(`/login`))
                return dispatch(updateNarrativeFailure())
            default:
                return dispatch(updateNarrativeFailure())
        }
    }
    catch (e) {
        return dispatch(updateNarrativeFailure())
    }
}

export default updateNarrative