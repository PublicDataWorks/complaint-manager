import { push } from "react-router-redux";
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
import {
  startSubmit,
  stopSubmit,
} from "redux-form";
import { UPDATE_CASE_STATUS_FORM_NAME } from "../../../sharedUtilities/constants";

const setCaseStatus = (caseId, status, redirectUrl) => async dispatch => {
  try {
    dispatch(startSubmit(UPDATE_CASE_STATUS_FORM_NAME));
    const response = await axios.put(
      `api/cases/${caseId}/status`,
      JSON.stringify({ status })
    );
    dispatch(updateCaseStatusSuccess(response.data));
    dispatch(snackbarSuccess("Status was successfully updated"));
    if (redirectUrl) {
      dispatch(push(redirectUrl));
    }
    dispatch(stopSubmit(UPDATE_CASE_STATUS_FORM_NAME));
    return dispatch(closeCaseStatusUpdateDialog());
  } catch (err) {
    dispatch(stopSubmit(UPDATE_CASE_STATUS_FORM_NAME));
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
