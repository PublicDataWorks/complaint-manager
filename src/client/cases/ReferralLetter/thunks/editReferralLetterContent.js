import { push } from "connected-react-router";
import axios from "axios/index";
import config from "../../../config/config";
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
    const hostname = config[process.env.NODE_ENV].hostname;
    await axios.put(
      `${hostname}/api/cases/${caseId}/referral-letter/content`,
      editedLetterHtml
    );
    dispatch(push(redirectUrl));
    dispatch(snackbarSuccess("Letter was successfully updated"));
  } catch (error) {
    dispatch(
      snackbarError(
        "Something went wrong and the letter was not updated. Please try again."
      )
    );
  }
};

export default editReferralLetterContent;
