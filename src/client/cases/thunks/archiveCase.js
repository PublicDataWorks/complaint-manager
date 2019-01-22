import axios from "axios";
import { closeArchiveCaseDialog } from "../../actionCreators/casesActionCreators";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { push } from "react-router-redux";
import { startSubmit, stopSubmit } from "redux-form";
import { ARCHIVE_CASE_FORM_NAME } from "../../../sharedUtilities/constants";

const archiveCase = caseId => async dispatch => {
  try {
    dispatch(startSubmit(ARCHIVE_CASE_FORM_NAME));
    await axios.delete(`api/cases/${caseId}`);

    dispatch(push("/"));
    dispatch(snackbarSuccess("Case was successfully archived"));
    dispatch(closeArchiveCaseDialog());
    return dispatch(stopSubmit(ARCHIVE_CASE_FORM_NAME));
  } catch (error) {
    dispatch(stopSubmit(ARCHIVE_CASE_FORM_NAME));
  }
};

export default archiveCase;
