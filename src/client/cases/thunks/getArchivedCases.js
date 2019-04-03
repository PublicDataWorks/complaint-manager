import { getArchivedCasesSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";

const getArchivedCases = (sortBy, sortDirection, page) => async dispatch => {
  try {
    let url = `api/cases/all/archived-cases/${sortBy}/${sortDirection}`;
    if (page) {
      url += `?page=${page}`;
    }
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
