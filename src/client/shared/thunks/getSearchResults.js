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
    if (paginatingSearch) {
      searchCriteria = { ...searchCriteria, page: newPage };
    } else {
      dispatch(searchInitiated());
    }

    const response = await fetchSearchResults(searchCriteria, resourceToSearch);
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

const fetchSearchResults = async (searchCriteria, resourceToSearch) => {
  const url = `${hostname}/api/${resourceToSearch}/search`;
  const encodedUri = encodeUriWithParams(url, searchCriteria);
  return await axios.get(encodedUri);
};

export default getSearchResults;
