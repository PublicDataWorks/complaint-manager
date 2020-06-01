import axios from "axios";
import {
  fetchingCaseTags,
  getCaseTagSuccess
} from "../../actionCreators/casesActionCreators";

const getCaseTags = caseId => async dispatch => {
  try {
    dispatch(fetchingCaseTags(true));
    const response = await axios.get(`api/cases/${caseId}/case-tags`);
    dispatch(getCaseTagSuccess(response.data));
    return dispatch(fetchingCaseTags(false));
  } catch (error) {}
};

export default getCaseTags;
