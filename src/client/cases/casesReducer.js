const casesReducer = (state = [], action) => {
    switch (action.type) {
        case 'CASE_CREATED_SUCCESS':
            return state.concat(action.caseDetails)
        default:
            return state
    }
}

export default casesReducer