import { getCasesSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";

const getCases = () => async dispatch => {
  try {
    const response = await axios.get(`api/cases`);
    return dispatch(getCasesSuccess(response.data.cases));
  } catch (e) {}
};

export default getCases;
