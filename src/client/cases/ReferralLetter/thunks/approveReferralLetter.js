import { push } from "react-router-redux";
import axios from "axios/index";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const approveReferralLetter = (caseId, callback) => async dispatch => {
  try {
    await axios.put(`api/cases/${caseId}/referral-letter/approve-letter`);
    dispatch(snackbarSuccess("Status was successfully updated"));
    dispatch(push(`/cases/${caseId}`));
  } catch (error) {
  } finally {
    callback();
  }
};

export default approveReferralLetter;
