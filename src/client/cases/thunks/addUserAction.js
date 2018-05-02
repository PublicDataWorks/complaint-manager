import getAccessToken from "../../auth/getAccessToken";
import {push} from "react-router-redux"
import {
    addUserActionFailure, addUserActionSuccess,
    closeUserActionDialog
} from "../../actionCreators/casesActionCreators";
import config from "../../config/config";

const hostname = config[process.env.NODE_ENV].hostname

const addUserAction = (values) => async (dispatch) => {
    try {
        const token = getAccessToken()

        if (!token) {
            return dispatch(push('/login'))
        }

        const response = await fetch(`${hostname}/api/cases/${values.caseId}/recent-activity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(values)
        })

        switch (response.status) {
            case 201:
                const recentActivity = await response.json()
                dispatch(addUserActionSuccess(recentActivity))
                return dispatch(closeUserActionDialog())
            case 401:
                return dispatch(push('/login'))
            case 500:
                return dispatch(addUserActionFailure())
            default:
                return dispatch(addUserActionFailure())
        }
    }

    catch (error) {
        return dispatch(addUserActionFailure())
    }


}

export default addUserAction