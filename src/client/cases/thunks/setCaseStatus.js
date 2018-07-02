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

const setCaseStatus = (caseId, status) => async dispatch => {
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

    dispatch(snackbarSuccess("Status successfully updated"));
    dispatch(closeCaseStatusUpdateDialog());
    return dispatch(updateCaseStatusSuccess(response.data));
  } catch (err) {
    return dispatch(
      snackbarError("Something went wrong and the case status was not updated.")
    );
  }
};

export default setCaseStatus;
