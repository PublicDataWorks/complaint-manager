import axios from "axios";
import { closeArchiveCaseDialog } from "../../actionCreators/casesActionCreators";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";
import { push } from "react-router-redux";

const archiveCase = caseId => async dispatch => {
  try {
    await axios.delete(`api/cases/${caseId}`);

    dispatch(snackbarSuccess("Case was successfully archived"));
    dispatch(closeArchiveCaseDialog());
    return dispatch(push(`/`));
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and the case was not archived. Please try again."
      )
    );
  }
};

export default archiveCase;
