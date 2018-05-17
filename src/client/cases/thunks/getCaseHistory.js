import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import config from "../../config/config";
import { getCaseHistorySuccess } from "../../actionCreators/caseHistoryActionCreators";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

const getCaseHistory = caseId => async dispatch => {
  const hostname = config[process.env.NODE_ENV].hostname;
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push(`/login`));
    }

    const response = await fetch(
      `${hostname}/api/cases/${caseId}/case-history`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    switch (response.status) {
      case 200:
        const responseBody = await response.json();
        return dispatch(getCaseHistorySuccess(responseBody));
      case 401:
        return dispatch(push(`/login`));
      default:
        return dispatch(
          snackbarError(
            "Something went wrong and we could not fetch the case history."
          )
        );
    }
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and we could not fetch the case history."
      )
    );
  }
};

export default getCaseHistory;
