import { push } from "react-router-redux";
import axios from "axios/index";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";

const approveReferralLetter = (caseId, callback) => async dispatch => {
  try {
    await axios.put(`api/cases/${caseId}/referral-letter/approve-letter`);
    dispatch(snackbarSuccess("Status was successfully updated"));
    dispatch(push(`/cases/${caseId}`));
  } catch (error) {
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
