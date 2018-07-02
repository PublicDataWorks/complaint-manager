import getAccessToken from "../../auth/getAccessToken";
import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import { push } from "react-router-redux";
import config from "../../config/config";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const getCaseDetails = caseId => async dispatch => {
  try {
    const token = getAccessToken();

    if (!token) {
      return dispatch(push(`/login`));
    }

    const response = await axios(`${hostname}/api/cases/${caseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    return dispatch(getCaseDetailsSuccess(response.data));
  } catch (e) {}
};

export default getCaseDetails;
