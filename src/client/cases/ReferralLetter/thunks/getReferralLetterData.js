import axios from "axios/index";
import { getReferralLetterSuccess } from "../../../actionCreators/letterActionCreators";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import invalidCaseStatusRedirect from "../../thunks/invalidCaseStatusRedirect";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const getReferralLetterData = caseId => async dispatch => {
  try {
    const response = await axios.get(`api/cases/${caseId}/referral-letter`);
    return dispatch(getReferralLetterSuccess(response.data));
  } catch (error) {
    if (
      error.response &&
      error.response.data.message === BAD_REQUEST_ERRORS.INVALID_CASE_STATUS
    ) {
      return dispatch(invalidCaseStatusRedirect(caseId));
    }
    dispatch(
      snackbarError(
        "Something went wrong and the page could not be loaded. Please try again."
      )
    );
  }
};

export default getReferralLetterData;
