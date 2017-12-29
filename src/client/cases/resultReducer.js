const getErrorMessage = errorCode => {
  switch (errorCode) {
    case 500:
      return '500 Internal Server Error: Case not saved. Please try again.'
    default:
      return 'Unknown Error: Case not saved. Please try again'
  }
}

const resultReducer = (state = null, action) => {
  switch (action.type) {
    case 'CASE_CREATED_SUCCESS':
      return {
        type: 'SUCCESS',
        message: `Case ${action.caseDetails.id} was successfully created`
      }
    case 'CASE_CREATION_REQUESTED':
      return null
    case 'CASE_CREATION_FAILED':
      return {
        type: 'FAILED',
        message: getErrorMessage(action.error)
      }
    default:
      return state
  }
}

export default resultReducer