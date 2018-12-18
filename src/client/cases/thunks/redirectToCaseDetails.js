import { push } from "react-router-redux";

const redirectToCaseDetails = caseId => async dispatch => {
  dispatch(push(`/cases/${caseId}`));
};

export default redirectToCaseDetails;
