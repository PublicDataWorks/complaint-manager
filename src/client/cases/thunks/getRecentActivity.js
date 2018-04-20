import config from "../../config/config";
import {getRecentActivitySuccess} from "../../actionCreators/casesActionCreators";
import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";

const hostname = config[process.env.NODE_ENV].hostname

const getRecentActivity =  (caseId) => async (dispatch) => {
    try {

        const token = getAccessToken()
        if (!token){
            return dispatch(push('/login'))
        }

        const response = await fetch(`${hostname}/api/cases/${caseId}/recent-activity`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        switch (response.status) {
            case 200:
                const recentActivity = await response.json()
                return dispatch(getRecentActivitySuccess(recentActivity))
            case 401:
                return dispatch(push('/login'))
            default:
                return

        }
    }
    catch (error) {
    }
}

export default getRecentActivity