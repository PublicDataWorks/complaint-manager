import {
  closeRemoveCaseNoteDialog,
  removeCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";
import { REMOVE_CASE_NOTE_FORM_NAME } from "../../../sharedUtilities/constants";
import axios from "axios";
import { startSubmit, stopSubmit } from "redux-form";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

const removeCaseNote = (caseId, caseNoteId) => async dispatch => {
  try {
    dispatch(startSubmit(REMOVE_CASE_NOTE_FORM_NAME));
    const response = await axios.delete(
      `api/cases/${caseId}/case-notes/${caseNoteId}`
    );
    dispatch(closeRemoveCaseNoteDialog());
    dispatch(stopSubmit(REMOVE_CASE_NOTE_FORM_NAME));
    dispatch(snackbarSuccess("Case note was successfully removed"));
    return dispatch(removeCaseNoteSuccess(response.data));
  } catch (error) {
    dispatch(stopSubmit(REMOVE_CASE_NOTE_FORM_NAME));
  }
};

export default removeCaseNote;
