import {
  addCaseNoteFailure,
  addCaseNoteSuccess,
  closeCaseNoteDialog
} from "../../actionCreators/casesActionCreators";
import axios from "axios";
import { startSubmit, stopSubmit} from "redux-form";
import { CASE_NOTE_FORM_NAME } from "../../../sharedUtilities/constants";

const addCaseNote = values => async dispatch => {
  try {
    dispatch(startSubmit(CASE_NOTE_FORM_NAME));
    const response = await axios.post(
      `api/cases/${values.caseId}/case-notes`,
      JSON.stringify(values)
    );
    dispatch(
      addCaseNoteSuccess(response.data.caseDetails, response.data.caseNotes)
    );
    dispatch(stopSubmit(CASE_NOTE_FORM_NAME));
    return dispatch(closeCaseNoteDialog());
  } catch (error) {
    dispatch(stopSubmit(CASE_NOTE_FORM_NAME));
    return dispatch(addCaseNoteFailure());
  }
};

export default addCaseNote;
