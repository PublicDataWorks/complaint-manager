import { getCaseHistorySuccess } from "../../actionCreators/caseHistoryActionCreators";
import axios from "axios";

const getCaseHistory = caseId => async dispatch => {
  try {
    const caseHistoryResponse = await axios.get(
      `api/cases/${caseId}/case-history`
    );
    return dispatch(getCaseHistorySuccess(caseHistoryResponse.data));
  } catch (error) {}
};

export default getCaseHistory;
