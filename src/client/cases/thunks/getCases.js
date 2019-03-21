import { getWorkingCasesSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";

const getCases = (sortBy, sortDirection) => async dispatch => {
  try {
    const response = await axios.get(
      `api/cases/all/${sortBy}/${sortDirection}`
    );
    return dispatch(getWorkingCasesSuccess(response.data.cases));
  } catch (e) {}
};

export default getCases;
