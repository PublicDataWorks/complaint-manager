import getAccessToken from "../../auth/getAccessToken";
import {push} from "react-router-redux"
import config from "../../config/config";
import {updateIncidentDetailsFailure, updateIncidentDetailsSuccess} from "../../actionCreators/casesActionCreators";


const hostname = config[process.env.NODE_ENV].hostname


const editIncidentDetails = (incidentDetails, closeDialogCallback) => async (dispatch) => {
    try {
        const token = getAccessToken()

        if (!token) {
            return dispatch(push('/login'))
        }

        const response = await fetch(`${hostname}/api/cases/${incidentDetails.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(incidentDetails)
        })

        switch (response.status) {
            case 200:
                const updatedCase = await response.json()
                closeDialogCallback()
                return dispatch(updateIncidentDetailsSuccess(updatedCase))
            case 401:
                return dispatch(push('/login'))
            default:
                return dispatch(updateIncidentDetailsFailure())
        }
    }
    catch (error) {
        return dispatch(updateIncidentDetailsFailure())
    }
}

export default editIncidentDetails