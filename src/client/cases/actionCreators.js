const testing = process.env.NODE_ENV === 'test'
const hostname = testing ? 'http://localhost' : ''


export const createCase = (caseDetails) => async (dispatch) => {
    dispatch(requestCaseCreation())

  try {
    const response = await fetch(`${hostname}/cases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(caseDetails)
    })

    if (response.status < 200 || response.status > 299) throw response.status

    const responseBody = await response.json()

    return dispatch(createCaseSuccess(responseBody))
  } catch (e) {
    dispatch(createCaseFailure(e))
  }
}

export const createCaseSuccess = (caseDetails) => ({
  type: 'CASE_CREATED_SUCCESS',
  caseDetails
})

export const requestCaseCreation = () => ({
  type: 'CASE_CREATION_REQUESTED'
})

export const createCaseFailure = (error) => ({
    type: 'CASE_CREATION_FAILED',
    error
})
