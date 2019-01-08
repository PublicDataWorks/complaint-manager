import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

const getCaseDetails = caseId => async dispatch => {
  try {
    const caseDetailsResponse = await axios.get(`api/cases/${caseId}`);
    return dispatch(getCaseDetailsSuccess(caseDetailsResponse.data));
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and the case details were not loaded. Please try again."
      )
    );
  }
};

export default getCaseDetails;
