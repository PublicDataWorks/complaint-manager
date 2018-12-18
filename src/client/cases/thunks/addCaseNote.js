import {
  addCaseNoteFailure,
  addCaseNoteSuccess,
  closeCaseNoteDialog
} from "../../actionCreators/casesActionCreators";
import config from "../../config/config";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const addCaseNote = values => async dispatch => {
  try {
    const response = await axios.post(
      `${hostname}/api/cases/${values.caseId}/case-notes`,
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
