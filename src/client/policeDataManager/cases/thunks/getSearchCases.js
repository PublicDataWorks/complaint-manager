import axios from "axios";
import { searchCasesSuccess, searchCasesFailed } from "../../actionCreators/searchCasesActionCreators";

const getSearchCases = (queryString, sortBy, sortDirection, currentPage = 1) => async dispatch => {
  try {
    const response = await axios.get(`api/cases/search`, {
      params: {
        queryString,
        sortBy,
        sortDirection,
        currentPage
      }
    });
    dispatch(searchCasesSuccess(response.data));
  } catch (error) {
    console.error(error);
    dispatch(searchCasesFailed());
  }
};

export default getSearchCases;

