import { getArchivedCasesSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";
import encodeUriWithQueryParams from "../../utilities/encodeUriWithQueryParams";

const getArchivedCases = (sortBy, sortDirection, page) => async dispatch => {
  const queryParams = {};
  if (sortBy) queryParams.sortBy = sortBy;
  if (sortDirection) queryParams.sortDirection = sortDirection;
  if (page) queryParams.page = page;

  try {
    let url = `api/cases/archived-cases`;
    url = encodeUriWithQueryParams(url, queryParams);
    const response = await axios.get(url);
    return dispatch(
      getArchivedCasesSuccess(
        response.data.cases.rows,
        response.data.cases.count,
        page
      )
    );
  } catch (e) {}
};

export default getArchivedCases;
