import getAccessToken from "../../auth/getAccessToken";
import config from "../../config/config";
import { push } from "react-router-redux";
import { addOfficerToCaseSuccess, addOfficerToCaseFailure } from "../../actionCreators/officersActionCreators";

const hostname = config[process.env.NODE_ENV].hostname

const addOfficer = (caseId, officerId) => async (dispatch) => {
    try {
        const token = getAccessToken()

        if (!token) {
            dispatch(push('/login'))
            throw new Error('No access token found');
        }
        const response = await fetch(`${hostname}/api/cases/${caseId}/officers/${officerId}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (response.status === 200) {
            dispatch(addOfficerToCaseSuccess(await response.json()))
            dispatch(push(`/cases/${caseId}`))
        } else if (response.status === 401) {
            dispatch(push('/login'))
        } else {
            dispatch(addOfficerToCaseFailure())
        }

    } catch (e) {
    }
}
export default addOfficer