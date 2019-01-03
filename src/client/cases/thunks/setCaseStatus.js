import { push } from "react-router-redux";
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
  try {
    const response = await axios.put(
      `${hostname}/api/cases/${caseId}/status`,
      JSON.stringify({ status })
    );
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
