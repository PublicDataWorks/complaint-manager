import { push } from "react-router-redux";
import axios from "axios/index";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const editIAProCorrections = (
  caseId,
  iaProCorrectionValues,
  successRedirectRoute
) => async dispatch => {
  try {
    await axios.put(
      `api/cases/${caseId}/referral-letter/iapro-corrections`,
      iaProCorrectionValues
    );
    dispatch(snackbarSuccess("IAPro corrections were successfully updated"));
    return dispatch(push(successRedirectRoute));
  } catch (error) {
    if (
      error.response &&
      error.response.data.message === BAD_REQUEST_ERRORS.INVALID_CASE_STATUS
    ) {
      return dispatch(push(`/cases/${caseId}`));
    }
    dispatch(
      snackbarError(
        "Something went wrong and the IAPro corrections were not updated. Please try again."
      )
    );
  }
};

export default editIAProCorrections;
