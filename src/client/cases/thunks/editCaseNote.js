import {
  closeCaseNoteDialog,
  editCaseNoteFailure,
  editCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";
import axios from "axios";

const editCaseNote = values => async dispatch => {
  try {
    const response = await axios.put(
      `api/cases/${values.caseId}/case-notes/${values.id}`,
      JSON.stringify(values)
    );
    dispatch(editCaseNoteSuccess(response.data));
    return dispatch(closeCaseNoteDialog());
  } catch (error) {
    return dispatch(editCaseNoteFailure());
  }
};

export default editCaseNote;
