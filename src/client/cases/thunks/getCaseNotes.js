import config from "../../config/config";
import { getCaseNotesSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const getCaseNotes = caseId => async dispatch => {
  try {
    const response = await axios.get(`${hostname}/api/cases/${caseId}/case-notes`);
    return dispatch(getCaseNotesSuccess(response.data));
  } catch (error) {}
};

export default getCaseNotes;
