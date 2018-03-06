const initialState = {}
const caseDetailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_CASE_DETAILS_SUCCESS':
        case 'NARRATIVE_UPDATE_SUCCEEDED':
        case 'ATTACHMENT_UPLOAD_SUCCEEDED':
            return action.caseDetails
        case 'EDIT_CIVILIAN_SUCCESS':
            return {
                ...state,
                status: 'Active',
                civilians: [action.civilian]
            }
        default:
            return state
    }
}

export default caseDetailsReducer