import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import config from "../../config/config";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";
import {
  closeCaseStatusUpdateDialog,
  updateCaseStatusSuccess
} from "../../actionCreators/casesActionCreators";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const setCaseStatus = (caseId, status, callback) => async dispatch => {
  const token = getAccessToken();
  if (!token) {
    return dispatch(push("/login"));
  }

  try {
    const response = await axios(`${hostname}/api/cases/${caseId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      data: JSON.stringify({
        status
      })
    });

    dispatch(updateCaseStatusSuccess(response.data));
    if (callback) {
      callback();
    }
    dispatch(snackbarSuccess("Status successfully updated"));
    return dispatch(closeCaseStatusUpdateDialog());
  } catch (err) {
    return dispatch(
      snackbarError("Something went wrong and the case status was not updated.")
    );
  }
};

export default setCaseStatus;
