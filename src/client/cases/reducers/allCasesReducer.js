const allCasesReducer = (state = [], action) => {
    switch (action.type) {
        case 'GET_CASES_SUCCESS':
            return action.cases
        case 'CASE_CREATED_SUCCESS':
            return state.concat(action.caseDetails)
        case 'NARRATIVE_UPDATE_SUCCEEDED':
            return findAndReplaceUpdatedCase(state, action.caseDetails)
        default:
            return state
    }
}

const findAndReplaceUpdatedCase = (state, updatedCase) => {
    const index = state.findIndex((n) => n.id === updatedCase.id)
    const firstHalf = state.slice(0, index)
    const lastHalf = state.slice(index +1, state.length)

    return firstHalf.concat(updatedCase).concat(lastHalf)
}

export default allCasesReducer