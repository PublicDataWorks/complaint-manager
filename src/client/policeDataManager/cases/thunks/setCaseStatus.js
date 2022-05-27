import { push } from "connected-react-router";
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
      { status }
    );
    dispatch(snackbarSuccess("Status was successfully updated"));
    if (redirectUrl) {
      dispatch(push(redirectUrl));
    }
    dispatch(updateCaseStatusSuccess(response.data));
    return dispatch(closeCaseStatusUpdateDialog());
  } catch (err) {}
};

export default setCaseStatus;
