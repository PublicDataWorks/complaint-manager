import {push} from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import {
    closeUserActionDialog,
    editUserActionFailure, editUserActionSuccess
} from "../../actionCreators/casesActionCreators";
import config from "../../config/config";

const hostname = config[process.env.NODE_ENV].hostname

const editUserAction = (values) => async(dispatch) => {
    try {
        const token = getAccessToken()
        if (!token) {
            return dispatch(push('/login'))
        }

        const response = await fetch(`${hostname}/api/cases/${values.caseId}/recent-activity/${values.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(values)
        })

        switch (response.status) {
            case 200:
                const recentActivity = await response.json()
                dispatch(editUserActionSuccess(recentActivity))
                return dispatch(closeUserActionDialog())
            case 401:
                return dispatch(push('/login'))
            case 500:
                return dispatch(editUserActionFailure())
            default:
                return dispatch(editUserActionFailure())
        }
    }
    catch (error) {
        return dispatch(editUserActionFailure())
    }

}

export default editUserAction