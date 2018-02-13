import {createCaseFailure, createCaseSuccess, requestCaseCreation} from "../actionCreators";
import {reset} from "redux-form";
import {push} from 'react-router-redux'
import getAccessToken from "../../auth/getAccessToken";

const testing = process.env.NODE_ENV === 'test'
const hostname = testing ? 'http://localhost' : ''

const createCase = (creationDetails) => async (dispatch) => {
    dispatch(requestCaseCreation())

    try {
        const token = getAccessToken()

        if (!token){
            dispatch(push(`/login`))
            throw Error('No Token')
        }

        const response = await fetch(`${hostname}/cases`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(creationDetails.caseDetails)
        })

        switch (response.status) {
            case 201:
                const createdCase = await response.json()
                dispatch(createCaseSuccess(createdCase))

                if (creationDetails.redirect) {
                    dispatch(push(`/cases/${createdCase.id}`))
                }
                return dispatch(reset('CreateCase'))
            case 401:
                dispatch(createCaseFailure())
                return dispatch(push(`/login`))
            default:
                throw response.status
        }
    } catch (e) {
        dispatch(createCaseFailure())
    }
}

export default createCase