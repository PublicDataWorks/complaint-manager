import { push } from "react-router-redux";
import axios from "axios/index";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";

const editReferralLetterContent = (
  caseId,
  editedLetterHtml,
  redirectUrl
) => async dispatch => {
  try {
    await axios.put(
      `api/cases/${caseId}/referral-letter/content`,
      editedLetterHtml
    );
    dispatch(push(redirectUrl));
    dispatch(snackbarSuccess("Letter was successfully updated"));
  } catch (error) {}
};

export default editReferralLetterContent;
