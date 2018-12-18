import getAccessToken from "../../auth/getAccessToken";
import { push } from "connected-react-router";
import config from "../../config/config";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";
import {
  closeCaseStatusUpdateDialog,
  openCaseValidationDialog,
  updateCaseStatusSuccess
} from "../../actionCreators/casesActionCreators";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const setCaseStatus = (caseId, status, redirectUrl) => async dispatch => {
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
    dispatch(snackbarSuccess("Status was successfully updated"));
    if (redirectUrl) {
      dispatch(push(redirectUrl));
    }
    return dispatch(closeCaseStatusUpdateDialog());
  } catch (err) {
    if (err.response && err.response.status === 400) {
      dispatch(closeCaseStatusUpdateDialog());
      return dispatch(openCaseValidationDialog(err.response.data.details));
    }
    return dispatch(
      snackbarError(
        "Something went wrong and the case status was not updated. Please try again."
      )
    );
  }
};

export default setCaseStatus;
