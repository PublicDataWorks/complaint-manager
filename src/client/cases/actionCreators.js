const testing = process.env.NODE_ENV === 'test'
const hostname = testing ? 'http://localhost' : ''

export const createCase = (caseDetails) => async (dispatch) => {
    // dispatch({ type: CASE_CREATION_REQUESTED }

    // try {
        const response = await fetch(`${hostname}/cases`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(caseDetails)
        })

        // check response status is 2xx, otherwise throw an error

        const responseBody = await response.json()

        return dispatch(createCaseSuccess(responseBody))
    // } catch (e) {
        // dispatch(createCaseFailure(e))
    // }
}

export const createCaseSuccess = (caseDetails) => ({
    type: 'CASE_CREATED_SUCCESS',
    caseDetails
})