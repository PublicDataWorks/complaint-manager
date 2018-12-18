import getAccessToken from "../../auth/getAccessToken";
import { push } from "connected-react-router";
import config from "../../config/config";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";
import encodeUriWithParams from "../../utilities/encodeUriWithParams";
import {
  searchFailed,
  searchInitiated,
  searchSuccess
} from "../../actionCreators/searchActionCreators";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const getSearchResults = (
  searchCriteria,
  resourceToSearch,
  paginatingSearch = false,
  newPage = undefined
) => async dispatch => {
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push("/login"));
    }
    if (paginatingSearch) {
      searchCriteria = { ...searchCriteria, page: newPage };
    } else {
      dispatch(searchInitiated());
    }

    const response = await fetchSearchResults(
      token,
      searchCriteria,
      resourceToSearch
    );
    return dispatch(searchSuccess(response.data, newPage));
  } catch (error) {
    dispatch(searchFailed());
    return dispatch(
      snackbarError(
        "Something went wrong and the search was not completed. Please try again."
      )
    );
  }
};

const fetchSearchResults = async (token, searchCriteria, resourceToSearch) => {
  const url = `${hostname}/api/${resourceToSearch}/search`;
  const encodedUri = encodeUriWithParams(url, searchCriteria);

  return await axios(encodedUri, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
};

export default getSearchResults;
