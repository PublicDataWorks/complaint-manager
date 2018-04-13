import getAccessToken from "../../auth/getAccessToken";
import {push} from "react-router-redux";
import config from "../../config/config";
import {snackbarError} from "../../actionCreators/snackBarActionCreators";
import encodeUriWithParams from "../../utilities/encodeUriWithParams";
import {
    searchOfficersFailed, searchOfficersInitiated,
    searchOfficersSuccess
} from "../../actionCreators/officersActionCreators";
const hostname = config[process.env.NODE_ENV].hostname;

const getOfficerSearchResults = (searchCriteria, caseId) => async (dispatch) => {
    try {
        const token = getAccessToken();
        if (!token) { return dispatch(push("/login")) }
        dispatch(searchOfficersInitiated())
        const response = await fetchSearchResults(token, searchCriteria, caseId);
        return await handleResponse(response, dispatch);
    } catch (error) {
        dispatch(searchOfficersFailed());
        return dispatch(snackbarError("Something went wrong on our end and we could not complete your search."));
    }
};

const fetchSearchResults = async (token, searchCriteria, caseId) => {
    const url = `${hostname}/api/cases/${caseId}/officers/search`;
    const encodedUri = encodeUriWithParams(url, searchCriteria)

    return await fetch(encodedUri, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    });
};

const handleResponse = async (response, dispatch) => {
    switch (response.status) {
        case 200:
            const searchResults = await response.json();
            return dispatch(searchOfficersSuccess(searchResults));
        case 401:
            return dispatch(push("/login"));
        default:
            dispatch(searchOfficersFailed());
            return dispatch(snackbarError("Something went wrong on our end and we could not complete your search."));
    }
};

export default getOfficerSearchResults;