import { push } from "connected-react-router";
import axios from "axios/index";
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";

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
