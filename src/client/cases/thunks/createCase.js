import {createCaseFailure, createCaseSuccess, requestCaseCreation} from "../actionCreators";
import {reset} from "redux-form";
import { push } from 'react-router-redux'

const testing = process.env.NODE_ENV === 'test'
const hostname = testing ? 'http://localhost' : ''

const createCase = (creationDetails) => async (dispatch) => {
    dispatch(requestCaseCreation())

    try {
        const response = await fetch(`${hostname}/cases`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(creationDetails.caseDetails)
        })

        if (response.status < 200 || response.status > 299) throw response.status

        const createdCase = await response.json()

        dispatch(createCaseSuccess(createdCase))

        if (creationDetails.redirect) {
            dispatch(push(`/case/${createdCase.id}`))
        }
        return dispatch(reset('CreateCase'))
    } catch (e) {
        dispatch(createCaseFailure())
    }
}

export default createCase