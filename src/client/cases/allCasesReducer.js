const allCasesReducer = (state = [], action) => {
    switch (action.type) {
        case 'GET_CASES_SUCCESS':
            return action.cases
        case 'CASE_CREATED_SUCCESS':
            return state.concat(action.caseDetails)
        default:
            return state
    }
}

export default allCasesReducer