import { push } from "react-router-redux";
import axios from "axios/index";
import config from "../../../config/config";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";

const editReferralLetterAddresses = (
  caseId,
  addressData,
  redirectUrl,
  alternativeCallback,
  alternativeFailureCallback
) => async dispatch => {
  try {
    const hostname = config[process.env.NODE_ENV].hostname;
    await axios.put(
      `${hostname}/api/cases/${caseId}/referral-letter/addresses`,
      addressData
    );
    if (alternativeCallback) {
      alternativeCallback();
    } else {
      dispatch(push(redirectUrl));
    }
    dispatch(snackbarSuccess("Letter was successfully updated"));
  } catch (error) {
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
