import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";

const getCaseDetails = caseId => async dispatch => {
  try {
    const caseDetailsResponse = await axios.get(`api/cases/${caseId}`);
    return dispatch(getCaseDetailsSuccess(caseDetailsResponse.data));
  } catch (error) {}
};

export default getCaseDetails;
