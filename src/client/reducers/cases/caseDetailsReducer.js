import {
    CIVILIAN_CREATION_SUCCEEDED,
    INCIDENT_DETAILS_UPDATE_SUCCEEDED,
    REMOVE_ATTACHMENT_SUCCESS
} from "../../../sharedUtilities/constants";

const initialState = {}
const caseDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_CASE_DETAILS_SUCCESS':
        case 'NARRATIVE_UPDATE_SUCCEEDED':
        case 'ATTACHMENT_UPLOAD_SUCCEEDED':
        case INCIDENT_DETAILS_UPDATE_SUCCEEDED:
        case REMOVE_ATTACHMENT_SUCCESS:
            return action.caseDetails
        case 'EDIT_CIVILIAN_SUCCESS':
        case CIVILIAN_CREATION_SUCCEEDED:
            return {
                ...state,
                status: 'Active',
                civilians: action.civilians
            }
        default:
            return state
    }
}

export default caseDetailsReducer