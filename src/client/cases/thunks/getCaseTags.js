import axios from "axios";
import { getCaseTagSuccess } from "../../actionCreators/casesActionCreators";

const getCaseTags = caseId => async dispatch => {
  try {
    const response = await axios.get(`api/cases/${caseId}/case-tags`);
    return dispatch(getCaseTagSuccess(response.data));
  } catch (error) {}
};

export default getCaseTags;
