import {
  closeCaseNoteDialog,
  editCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";
import axios from "axios";
import { startSubmit, stopSubmit } from "redux-form";
import { REASSIGN_CASE_FORM_NAME } from "../../../../sharedUtilities/constants";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

const updateCase = values => async dispatch => {
  try {
    console.log("updateCaseThunk");
    dispatch(startSubmit(REASSIGN_CASE_FORM_NAME));
    const response = await axios.put(`api/cases/${values.caseId}`, values);
    dispatch(stopSubmit(REASSIGN_CASE_FORM_NAME));
    console.log("here im here");
    return dispatch(snackbarSuccess("Case was successfully updated"));
    // dispatch(closeCaseNoteDialog());
  } catch (error) {
    dispatch(stopSubmit(REASSIGN_CASE_FORM_NAME));
  }
};

export default updateCase;
