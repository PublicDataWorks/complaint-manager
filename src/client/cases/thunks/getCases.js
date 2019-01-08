import { getCasesSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";

const getCases = params => async dispatch => {
  try {
    const response = await axios.get(`/api/cases`, { params });
    return dispatch(getCasesSuccess(response.data.cases));
  } catch (e) {}
};

export default getCases;
