
const caseCreationReducer = (state = false, action) => {
  switch (action.type) {
    case 'CASE_CREATED_SUCCESS':
      return false
    case 'CASE_CREATION_REQUESTED':
      return true
    default:
      return state
  }
}

export default caseCreationReducer