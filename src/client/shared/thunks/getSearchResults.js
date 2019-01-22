import encodeUriWithParams from "../../utilities/encodeUriWithParams";
import {
  searchFailed,
  searchInitiated,
  searchSuccess
} from "../../actionCreators/searchActionCreators";
import axios from "axios";

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
  }
};

const fetchSearchResults = async (searchCriteria, resourceToSearch) => {
  const url = `api/${resourceToSearch}/search`;
  const encodedUri = encodeUriWithParams(url, searchCriteria);
  return await axios.get(encodedUri);
};

export default getSearchResults;
