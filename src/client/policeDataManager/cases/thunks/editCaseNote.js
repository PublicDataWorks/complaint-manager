import { editCaseNoteSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";
import { startSubmit, stopSubmit } from "redux-form";
import { CASE_NOTE_FORM_NAME } from "../../../../sharedUtilities/constants";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

const editCaseNote = values => async dispatch => {
  try {
    dispatch(startSubmit(CASE_NOTE_FORM_NAME));
    const response = await axios.put(
      `api/cases/${values.caseId}/case-notes/${values.id}`,
      JSON.stringify(values)
    );

    dispatch(editCaseNoteSuccess(response.data));
    dispatch(snackbarSuccess("Case note was successfully updated"));
    return dispatch(stopSubmit(CASE_NOTE_FORM_NAME));
  } catch (error) {
    dispatch(stopSubmit(CASE_NOTE_FORM_NAME));
  }
};

export default editCaseNote;
