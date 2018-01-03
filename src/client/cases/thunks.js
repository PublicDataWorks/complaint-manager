import {createCaseFailure, createCaseSuccess, requestCaseCreation} from "./actionCreators";

const testing = process.env.NODE_ENV === 'test'
const hostname = testing ? 'http://localhost' : ''


export const createCase = (caseDetails) => async (dispatch) => {
    dispatch(requestCaseCreation())

    try {
        const response = await fetch(`${hostname}/cases`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(caseDetails)
        })

        if (response.status < 200 || response.status > 299) throw response.status

        const responseBody = await response.json()

        return dispatch(createCaseSuccess(responseBody))
    } catch (e) {
        dispatch(createCaseFailure(e))
    }
}