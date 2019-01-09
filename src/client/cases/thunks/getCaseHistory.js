import { getCaseHistorySuccess } from "../../actionCreators/caseHistoryActionCreators";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";
import axios from "axios";

const getCaseHistory = caseId => async dispatch => {
  try {
    const caseHistoryResponse = await axios.get(
      `api/cases/${caseId}/case-history`
    );
    return dispatch(getCaseHistorySuccess(caseHistoryResponse.data));
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and the case history was not loaded. Please try again."
      )
    );
  }
};

export default getCaseHistory;
