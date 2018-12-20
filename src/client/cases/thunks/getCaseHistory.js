import { getCaseHistorySuccess } from "../../actionCreators/caseHistoryActionCreators";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";
import axios from "axios";
import { getCaseNumberSuccess } from "../../actionCreators/casesActionCreators";

const getCaseHistory = caseId => async dispatch => {
  try {
    const caseHistoryResponse = await axios.get(
      `api/cases/${caseId}/case-history`
    );
    const caseNumberResponse = await axios.get(
      `api/cases/${caseId}/case-number`
    );
    dispatch(getCaseNumberSuccess(caseNumberResponse.data));
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
