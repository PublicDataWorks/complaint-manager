import { push } from "react-router-redux";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

const redirectToCaseDetails = caseId => async dispatch => {
  dispatch(push(`/cases/${caseId}`));
  dispatch(
    snackbarError("This case is in an invalid status to view this page")
  );
};

export default redirectToCaseDetails;
