import { getArchivedCasesSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";

const getArchivedCases = (sortBy, sortDirection) => async dispatch => {
  try {
    const response = await axios.get(
      `api/cases/all/archived-cases/${sortBy}/${sortDirection}`
    );
    return dispatch(
      getArchivedCasesSuccess(
        response.data.cases.rows,
        response.data.cases.count
      )
    );
  } catch (e) {}
};

export default getArchivedCases;
