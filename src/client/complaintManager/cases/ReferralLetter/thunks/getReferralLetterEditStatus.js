import axios from "axios/index";
import { getReferralLetterEditStatusSuccess } from "../../../actionCreators/letterActionCreators";

const getReferralLetterEditStatus = caseId => async dispatch => {
  try {
    const referralLetterEditStatusResponse = await axios.get(
      `api/cases/${caseId}/referral-letter/edit-status`
    );
    return dispatch(
      getReferralLetterEditStatusSuccess(
        referralLetterEditStatusResponse.data.editStatus
      )
    );
  } catch (error) {}
};

export default getReferralLetterEditStatus;
