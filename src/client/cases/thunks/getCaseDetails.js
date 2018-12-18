import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import config from "../../config/config";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const getCaseDetails = caseId => async dispatch => {
  try {
    const response = await axios.get(`${hostname}/api/cases/${caseId}`);
    return dispatch(getCaseDetailsSuccess(response.data));
  } catch (e) {}
};

export default getCaseDetails;
