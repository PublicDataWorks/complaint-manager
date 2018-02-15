const initialState = {}
const caseDetailsReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'GET_CASE_DETAILS_SUCCESS':
            return action.caseDetails
        case 'NARRATIVE_UPDATE_SUCCEEDED':
            return action.caseDetails
        default:
            return state
    }
}

export default caseDetailsReducer