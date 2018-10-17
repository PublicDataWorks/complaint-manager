import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import config from "../../config/config";
import { getCaseHistorySuccess } from "../../actionCreators/caseHistoryActionCreators";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";
import axios from "axios";

const getCaseHistory = caseId => async dispatch => {
  const hostname = config[process.env.NODE_ENV].hostname;
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push(`/login`));
    }

    const response = await axios(
      `${hostname}/api/cases/${caseId}/case-history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    return dispatch(getCaseHistorySuccess(response.data));
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and the case history was not loaded. Please try again."
      )
    );
  }
};

export default getCaseHistory;
