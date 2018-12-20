import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";

const getCaseDetails = caseId => async dispatch => {
  try {
    const response = await axios.get(`api/cases/${caseId}`);
    return dispatch(getCaseDetailsSuccess(response.data));
  } catch (e) {}
};

export default getCaseDetails;
