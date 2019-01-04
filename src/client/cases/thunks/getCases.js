import { getCasesSuccess } from "../../actionCreators/casesActionCreators";
import config from "../../config/config";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const getCases = params => async dispatch => {
  try {
    const response = await axios.get(`${hostname}/api/cases`, { params });
    return dispatch(getCasesSuccess(response.data));
  }
  catch (e) {}
};

export default getCases;
