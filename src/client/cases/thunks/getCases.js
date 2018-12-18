import { getCasesSuccess } from "../../actionCreators/casesActionCreators";
import config from "../../config/config";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const getCases = () => async dispatch => {
  try {
    const response = await axios.get(`${hostname}/api/cases`);
    return dispatch(getCasesSuccess(response.data.cases));
  } catch (e) {}
};

export default getCases;
