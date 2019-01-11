import {
  closeCaseNoteDialog,
  editCaseNoteFailure,
  editCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";
import axios from "axios";
import { startSubmit, stopSubmit } from "redux-form";
import { CASE_NOTE_FORM_NAME } from "../../../sharedUtilities/constants";

const editCaseNote = values => async dispatch => {
  try {
    dispatch(startSubmit(CASE_NOTE_FORM_NAME));
    const response = await axios.put(
      `api/cases/${values.caseId}/case-notes/${values.id}`,
      JSON.stringify(values)
    );
    dispatch(editCaseNoteSuccess(response.data));
    dispatch(stopSubmit(CASE_NOTE_FORM_NAME));
    return dispatch(closeCaseNoteDialog());
  } catch (error) {
    dispatch(stopSubmit(CASE_NOTE_FORM_NAME));
    return dispatch(editCaseNoteFailure());
  }
};

export default editCaseNote;
