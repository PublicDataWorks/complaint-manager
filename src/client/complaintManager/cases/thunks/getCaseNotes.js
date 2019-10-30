import { getCaseNotesSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";

const getCaseNotes = caseId => async dispatch => {
  try {
    const response = await axios.get(`api/cases/${caseId}/case-notes`);
    return dispatch(getCaseNotesSuccess(response.data));
  } catch (error) {}
};

export default getCaseNotes;
