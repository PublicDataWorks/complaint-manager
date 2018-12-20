import { push } from "react-router-redux";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

const redirectToCaseDetails = caseId => async dispatch => {
  dispatch(push(`/cases/${caseId}`));
  return dispatch(snackbarError("This case has already been approved"));
};

export default redirectToCaseDetails;
