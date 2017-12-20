const testing = process.env.NODE_ENV === 'test'
const hostname = testing ? 'http://localhost' : ''

export const createCase = (caseDetails) => async (dispatch) => {
    const response = await fetch(`${hostname}/cases`, {
        method: 'POST',
        body: JSON.stringify(caseDetails)
    })

    const responseBody = await response.json()

    return dispatch(createCaseSuccess(responseBody))
}

export const createCaseSuccess = (caseDetails) => ({
    type: 'CASE_CREATED_SUCCESS',
    caseDetails
})