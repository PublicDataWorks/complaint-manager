import { getWorkingCasesSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";

const getCases = (sortBy, sortDirection, page) => async dispatch => {
  try {
    let url = `api/cases/all/${sortBy}/${sortDirection}`;
    if (page) {
      url += `?page=${page}`;
    }
    const response = await axios.get(url);
    return dispatch(
      getWorkingCasesSuccess(
        response.data.cases.rows,
        response.data.cases.count
      )
    );
  } catch (e) {}
};

export default getCases;
