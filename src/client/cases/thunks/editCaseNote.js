import {
  closeCaseNoteDialog,
  editCaseNoteFailure,
  editCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";
import axios from "axios";
import getCaseNotes from "./getCaseNotes";

const editCaseNote = values => async dispatch => {
  try {
    const response = await axios.put(
      `api/cases/${values.caseId}/case-notes/${values.id}`,
      JSON.stringify(values)
    );
    dispatch(editCaseNoteSuccess(response.data));
    dispatch(closeCaseNoteDialog());
    return await dispatch(getCaseNotes(values.caseId));
  } catch (error) {
    return dispatch(editCaseNoteFailure());
  }
};

export default editCaseNote;
