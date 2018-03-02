import getAccessToken from "../../auth/getAccessToken";
import {getCaseDetailsSuccess} from "../actionCreators";
import {push} from "react-router-redux";
import config from '../../config/config'

const hostname = config[process.env.NODE_ENV].hostname

const getCaseDetails = (caseId) => async (dispatch) => {
    try {
        const token = getAccessToken()

        if (!token){
            dispatch(push(`/login`))
            throw Error('No Token')
        }

        const response = await fetch(`${hostname}/cases/${caseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        switch (response.status) {
            case 200:
            const responseBody = await response.json()
                return dispatch(getCaseDetailsSuccess(responseBody))
            case 401:
                return dispatch(push(`/login`))
            default:
                throw response.status
        }
    } catch (e) {
    }
}


export default getCaseDetails