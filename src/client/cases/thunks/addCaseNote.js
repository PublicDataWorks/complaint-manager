import {
  addCaseNoteFailure,
  addCaseNoteSuccess,
  closeCaseNoteDialog
} from "../../actionCreators/casesActionCreators";
import axios from "axios";

const addCaseNote = values => async dispatch => {
  try {
    const response = await axios.post(
      `api/cases/${values.caseId}/case-notes`,
      JSON.stringify(values)
    );
    dispatch(
      addCaseNoteSuccess(response.data.caseDetails, response.data.caseNotes)
    );
    return dispatch(closeCaseNoteDialog());
  } catch (error) {
    return dispatch(addCaseNoteFailure());
  }
};

export default addCaseNote;
