import getAccessToken from "../../auth/getAccessToken";
import { push } from "connected-react-router";
import config from "../../config/config";
import { getCaseHistorySuccess } from "../../actionCreators/caseHistoryActionCreators";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";
import axios from "axios";
import { getCaseNumberSuccess } from "../../actionCreators/casesActionCreators";

const getCaseHistory = caseId => async dispatch => {
  const hostname = config[process.env.NODE_ENV].hostname;
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push(`/login`));
    }

    const caseHistoryResponse = await axios(
      `${hostname}/api/cases/${caseId}/case-history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    const caseNumberResponse = await axios(
      `${hostname}/api/cases/${caseId}/case-number`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    dispatch(getCaseNumberSuccess(caseNumberResponse.data));

    return dispatch(getCaseHistorySuccess(caseHistoryResponse.data));
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and the case history was not loaded. Please try again."
      )
    );
  }
};

export default getCaseHistory;
