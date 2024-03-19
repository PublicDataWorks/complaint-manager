import {
  fetchingCaseNotes,
  getCaseNotesSuccess
} from "../../actionCreators/casesActionCreators";
import axios from "axios";

const getCaseNotes = caseId => async dispatch => {
  try {
    dispatch(fetchingCaseNotes(true));
    const response = await axios.get(`api/cases/${caseId}/case-notes`);
    dispatch(getCaseNotesSuccess(response.data));
    return dispatch(fetchingCaseNotes(false));
  } catch (error) {
    console.error(error);
  }
};

export default getCaseNotes;
