import {
  closeRemoveCaseNoteDialog,
  removeCaseNoteFailure,
  removeCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";
import { REMOVE_CASE_NOTE_FORM_NAME } from "../../../sharedUtilities/constants";
import axios from "axios";
import { startSubmit, stopSubmit } from "redux-form";

const removeCaseNote = (caseId, caseNoteId) => async dispatch => {
  try {
    dispatch(startSubmit(REMOVE_CASE_NOTE_FORM_NAME));
    const response = await axios.delete(
      `api/cases/${caseId}/case-notes/${caseNoteId}`
    );
    dispatch(closeRemoveCaseNoteDialog());
    dispatch(stopSubmit(REMOVE_CASE_NOTE_FORM_NAME));
    return dispatch(removeCaseNoteSuccess(response.data));
  } catch (error) {
    dispatch(stopSubmit(REMOVE_CASE_NOTE_FORM_NAME));
    return dispatch(removeCaseNoteFailure());
  }
};

export default removeCaseNote;
