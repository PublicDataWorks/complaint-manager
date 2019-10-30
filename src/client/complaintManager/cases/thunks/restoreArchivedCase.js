import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { closeRestoreArchivedCaseDialog } from "../../actionCreators/casesActionCreators";
import axios from "axios";
import getCaseDetails from "./getCaseDetails";
import { RESTORE_ARCHIVED_CASE_FORM } from "../../../../sharedUtilities/constants";
import { startSubmit, stopSubmit } from "redux-form";

const restoreArchivedCase = caseId => async dispatch => {
  try {
    dispatch(startSubmit(RESTORE_ARCHIVED_CASE_FORM));
    await axios.put(`api/cases/${caseId}/restore`);

    dispatch(snackbarSuccess("Case was successfully restored"));
    dispatch(getCaseDetails(caseId));
    dispatch(closeRestoreArchivedCaseDialog());
    return dispatch(stopSubmit(RESTORE_ARCHIVED_CASE_FORM));
  } catch (error) {
    dispatch(stopSubmit(RESTORE_ARCHIVED_CASE_FORM));
  }
};

export default restoreArchivedCase;
