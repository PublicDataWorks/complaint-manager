import { getCaseNoteActionsSuccess } from "../../actionCreators/caseNoteActionActionCreators";
import axios from "axios";

const getCaseNoteActionDropdownValues = () => async dispatch => {
  try {
    const response = await axios.get(`api/case-note-actions`);
    return dispatch(getCaseNoteActionsSuccess(response.data));
  } catch (error) {}
};

export default getCaseNoteActionDropdownValues;
