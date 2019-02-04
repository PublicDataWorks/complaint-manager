import { getArchivedCasesSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";

const getArchivedCases = () => async dispatch => {
  try {
    const response = await axios.get(`api/cases/archived`);
    return dispatch(getArchivedCasesSuccess(response.data.cases));
  } catch (e) {}
};

export default getArchivedCases;
