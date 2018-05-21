import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import config from "../../config/config";
import {
  clearSelectedOfficer,
  editCaseOfficerFailure,
  editCaseOfficerSuccess
} from "../../actionCreators/officersActionCreators";

const hostname = config[process.env.NODE_ENV].hostname;

const editCaseOfficer = (
  caseId,
  caseOfficerId,
  officerId,
  values
) => async dispatch => {
  const token = getAccessToken();

  if (!token) {
    return dispatch(push("/login"));
  }
  try {
    const payload = { ...values, officerId };
    const response = await fetch(
      `${hostname}/api/cases/${caseId}/cases-officers/${caseOfficerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }
    );

    switch (response.status) {
      case 200:
        const caseDetails = await response.json();
        dispatch(editCaseOfficerSuccess(caseDetails));
        dispatch(clearSelectedOfficer());
        return dispatch(push(`/cases/${caseId}`));
      case 401:
        return dispatch(push("/login"));
      case 500:
        return dispatch(editCaseOfficerFailure());
      default:
        return dispatch(editCaseOfficerFailure());
    }
  } catch (error) {
    return dispatch(editCaseOfficerFailure());
  }
};

export default editCaseOfficer;
