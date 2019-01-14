import {
  addCaseNoteFailure,
  addCaseNoteSuccess,
  closeCaseNoteDialog
} from "../../actionCreators/casesActionCreators";
import axios from "axios";
import getCaseNotes from "./getCaseNotes";

const addCaseNote = values => async dispatch => {
  try {
    const response = await axios.post(
      `api/cases/${values.caseId}/case-notes`,
      JSON.stringify(values)
    );
    dispatch(
      addCaseNoteSuccess(response.data.caseDetails, response.data.caseNotes)
    );
    dispatch(closeCaseNoteDialog());
    return await dispatch(getCaseNotes(values.caseId));
  } catch (error) {
    return dispatch(addCaseNoteFailure());
  }
};

export default addCaseNote;
