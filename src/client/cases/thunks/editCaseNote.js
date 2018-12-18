import {
  closeCaseNoteDialog,
  editCaseNoteFailure,
  editCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";
import config from "../../config/config";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const editCaseNote = values => async dispatch => {
  try {
    const response = await axios.put(
      `${hostname}/api/cases/${values.caseId}/case-notes/${values.id}`,
      JSON.stringify(values)
    );
    dispatch(editCaseNoteSuccess(response.data));
    return dispatch(closeCaseNoteDialog());
  } catch (error) {
    return dispatch(editCaseNoteFailure());
  }
};

export default editCaseNote;
