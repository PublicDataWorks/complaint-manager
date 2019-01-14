import { push } from "connected-react-router";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

const invalidCaseStatusRedirect = caseId => dispatch => {
  dispatch(push(`/cases/${caseId}`));
  dispatch(snackbarError("Sorry, that page is not available"));
};

export default invalidCaseStatusRedirect;
