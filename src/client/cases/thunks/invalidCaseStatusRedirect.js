import { push } from "react-router-redux";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

const invalidCaseStatusRedirect = caseId => async dispatch => {
  dispatch(push(`/cases/${caseId}`));
  return dispatch(snackbarError("Sorry, that page is not available"));
};

export default invalidCaseStatusRedirect;
