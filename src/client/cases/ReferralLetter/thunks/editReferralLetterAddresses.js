import { push } from "react-router-redux";
import axios from "axios/index";
import {
  startSubmit,
  stopSubmit,
} from 'redux-form';
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
import { UPDATE_CASE_STATUS_FORM_NAME } from "../../../../sharedUtilities/constants";

const editReferralLetterAddresses = (
  caseId,
  addressData,
  redirectUrl,
  alternativeCallback,
  alternativeFailureCallback
) => async dispatch => {
  try {
    dispatch(startSubmit(UPDATE_CASE_STATUS_FORM_NAME));
    await axios.put(
      `api/cases/${caseId}/referral-letter/addresses`,
      addressData
    );
    if (alternativeCallback) {
      alternativeCallback();
    } else {
      dispatch(push(redirectUrl));
    }
    dispatch(snackbarSuccess("Letter was successfully updated"));
    dispatch(stopSubmit(UPDATE_CASE_STATUS_FORM_NAME));
  } catch (error) {
    dispatch(stopSubmit(UPDATE_CASE_STATUS_FORM_NAME));
    if (alternativeFailureCallback) {
      alternativeFailureCallback();
    }
    dispatch(
      snackbarError(
        "Something went wrong and the letter was not updated. Please try again."
      )
    );
  }
};

export default editReferralLetterAddresses;
