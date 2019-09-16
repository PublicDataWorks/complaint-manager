import { push } from "connected-react-router";
import axios from "axios/index";
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";
import { assembleAddressRecipient } from "../../../utilities/fabricateAddressRecipient";

const editReferralLetterAddresses = (
  caseId,
  addressData,
  redirectUrl,
  alternativeCallback,
  alternativeFailureCallback
) => async dispatch => {
  try {
    addressData.recipient = assembleAddressRecipient(addressData.recipient_field);
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
  } catch (error) {
    if (alternativeFailureCallback) {
      alternativeFailureCallback();
    }
  }
};

export default editReferralLetterAddresses;
