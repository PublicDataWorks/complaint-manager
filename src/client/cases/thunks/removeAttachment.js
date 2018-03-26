import {push} from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import {removeAttachmentFailed, removeAttachmentSuccess} from "../../actionCreators/attachmentsActionCreators";
import config from '../../config/config'
const hostname = config[process.env.NODE_ENV].hostname

const removeAttachment = (caseId, fileName, shouldCloseDialog) => async(dispatch) => {
    try {
        const token = getAccessToken()

        if (!token) {
            dispatch(push(`/login`))
            throw Error('No Token')
        }
        const response = await fetch(`${hostname}/api/cases/${caseId}/attachments/${fileName}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })

        switch (response.status){
            case 200:
                const caseDetails = await response.json()
                shouldCloseDialog()
                return dispatch(removeAttachmentSuccess(caseDetails))
            case 500:
                return dispatch(removeAttachmentFailed())
            default:
                throw response.status
        }
    }
    catch (error){
        dispatch(removeAttachmentFailed())
    }
}

export default removeAttachment