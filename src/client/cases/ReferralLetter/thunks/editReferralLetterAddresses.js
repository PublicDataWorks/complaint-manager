import getAccessToken from "../../../auth/getAccessToken";
import { push } from "connected-react-router";
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
  const token = getAccessToken();
  if (!token) {
    return dispatch(push("/login"));
  }
  try {
    const hostname = config[process.env.NODE_ENV].hostname;
    await axios(`${hostname}/api/cases/${caseId}/referral-letter/addresses`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      data: addressData
    });
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
