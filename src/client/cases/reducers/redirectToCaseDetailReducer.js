const initialState = {
    redirect: false,
    caseId: ''
}

const redirectToCaseDetailReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'REDIRECT_TO_CASE_DETAIL':
            return {
                ...state,
                redirect: true
            }
        case 'CASE_CREATED_SUCCESS':
            return {
                ...state,
                caseId: action.caseDetails.id
            }
        case 'CASE_CREATION_FAILED':
            return initialState
        case 'CLEAR_REDIRECT_TO_CASE_DETAIL':
            return initialState
        default:
            return state
    }
}

export default redirectToCaseDetailReducer