import {updateNarrativeFailure, updateNarrativeSuccess} from "../actionCreators";

const testing = process.env.NODE_ENV === 'test'
const hostname = testing ? 'http://localhost' : ''

const updateNarrative = (updateDetails) => async (dispatch) => {
    try {
        const response = await fetch(`${hostname}/case/${updateDetails.id}/narrative`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({narrative: updateDetails.narrative})
        })

        const updatedCase = await response.json()

        return dispatch(updateNarrativeSuccess(updatedCase))
    }
    catch (e) {
        dispatch(updateNarrativeFailure())
    }
}

export default updateNarrative