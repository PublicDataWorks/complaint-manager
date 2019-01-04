import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";
import { getLetterTypeSuccess } from "../../actionCreators/letterActionCreators";

const getCaseDetails = caseId => async dispatch => {
  try {
    const caseDetailsResponse = await axios.get(`api/cases/${caseId}`);
    const letterTypeResponse = await axios.get(
      `api/cases/${caseId}/referral-letter/letter-type`
    );
    dispatch(getCaseDetailsSuccess(caseDetailsResponse.data));
    return dispatch(getLetterTypeSuccess(letterTypeResponse.data.letterType));
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and the case details were not loaded. Please try again."
      )
    );
  }
};

export default getCaseDetails;
