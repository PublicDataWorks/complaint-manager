import {getCasesSuccess} from "../actionCreators";

const testing = process.env.NODE_ENV === 'test'
const hostname = testing ? 'http://localhost' : ''

const getCases = () => async (dispatch) => {
    const response = await fetch(`${hostname}/cases`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })


    const responseBody = await response.json()

    return dispatch(getCasesSuccess(responseBody))
}

export default getCases