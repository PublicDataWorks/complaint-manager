import { push } from "react-router-redux";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import {
  closeCaseStatusUpdateDialog,
  updateCaseStatusSuccess
} from "../../actionCreators/casesActionCreators";
import axios from "axios";

const setCaseStatus = (caseId, status, redirectUrl) => async dispatch => {
  try {
    const response = await axios.put(
      `api/cases/${caseId}/status`,
      JSON.stringify({ status })
    );
    dispatch(closeCaseStatusUpdateDialog());
    dispatch(snackbarSuccess("Status was successfully updated"));
    if (redirectUrl) {
      dispatch(push(redirectUrl));
    }
    return dispatch(updateCaseStatusSuccess(response.data));
  } catch (err) {}
};

export default setCaseStatus;
