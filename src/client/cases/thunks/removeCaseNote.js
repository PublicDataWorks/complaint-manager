import {
  closeRemoveCaseNoteDialog,
  removeCaseNoteFailure,
  removeCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";
import axios from "axios";

const removeCaseNote = (caseId, caseNoteId) => async dispatch => {
  try {
    const response = await axios.delete(
      `api/cases/${caseId}/case-notes/${caseNoteId}`
    );
    dispatch(closeRemoveCaseNoteDialog());
    return dispatch(removeCaseNoteSuccess(response.data));
  } catch (error) {
    return dispatch(removeCaseNoteFailure());
  }
};

export default removeCaseNote;
