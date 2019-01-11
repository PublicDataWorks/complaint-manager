import { push } from "react-router-redux";
import axios from "axios/index";
import {
  startSubmit,
  stopSubmit,
} from 'redux-form';
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
import { UPDATE_CASE_STATUS_FORM_NAME } from "../../../../sharedUtilities/constants";

const approveReferralLetter = (caseId, callback) => async dispatch => {
  try {
    dispatch(startSubmit(UPDATE_CASE_STATUS_FORM_NAME));
    await axios.put(`api/cases/${caseId}/referral-letter/approve-letter`);
    dispatch(snackbarSuccess("Status was successfully updated"));
    dispatch(push(`/cases/${caseId}`));
    dispatch(stopSubmit(UPDATE_CASE_STATUS_FORM_NAME));
  } catch (error) {
    dispatch(stopSubmit(UPDATE_CASE_STATUS_FORM_NAME));
    if (
      error.response &&
      error.response.data.message === "Invalid case status"
    ) {
      dispatch(
        snackbarError("Case status could not be updated due to invalid status")
      );
      return dispatch(push(`/cases/${caseId}`));
    }
    dispatch(
      snackbarError(
        "Something went wrong and the case status was not updated. Please try again."
      )
    );
  } finally {
    callback();
  }
};

export default approveReferralLetter;
