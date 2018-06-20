import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import config from "../../config/config";
import {snackbarError, snackbarSuccess} from "../../actionCreators/snackBarActionCreators";
import {closeCaseStatusUpdateDialog, updateCaseStatusSuccess} from "../../actionCreators/casesActionCreators";

const hostname = config[process.env.NODE_ENV].hostname;

const setCaseStatus = (caseId, status) => async dispatch => {
  const token = getAccessToken();
  if (!token) {
    return dispatch(push("/login"));
  }

  const response = await fetch(`${hostname}/api/cases/${caseId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      status
    })
  });

  switch (response.status) {
    case 200:
      const caseDetails = await response.json()
      dispatch(snackbarSuccess("Status successfully updated"))
      dispatch(closeCaseStatusUpdateDialog())
      return dispatch(updateCaseStatusSuccess(caseDetails))

    case 401:
      return dispatch(push(`/login`));
    default:
      return dispatch(snackbarError("Something went wrong and the case status was not updated."));
  }
};

export default setCaseStatus;
