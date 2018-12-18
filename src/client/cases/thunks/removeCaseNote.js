import {
  closeRemoveCaseNoteDialog,
  removeCaseNoteFailure,
  removeCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";
import config from "../../config/config";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const removeCaseNote = (caseId, caseNoteId) => async dispatch => {
  try {
    const response = await axios.delete(
      `${hostname}/api/cases/${caseId}/case-notes/${caseNoteId}`
    );
    dispatch(closeRemoveCaseNoteDialog());
    return dispatch(removeCaseNoteSuccess(response.data));
  } catch (error) {
    return dispatch(removeCaseNoteFailure());
  }
};

export default removeCaseNote;
