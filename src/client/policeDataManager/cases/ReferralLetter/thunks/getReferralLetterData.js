import axios from "axios/index";
import { getReferralLetterSuccess } from "../../../actionCreators/letterActionCreators";

const getReferralLetterData = caseId => async dispatch => {
  try {
    const response = await axios.get(`api/cases/${caseId}/referral-letter`);
    return dispatch(getReferralLetterSuccess(response.data));
  } catch (error) {}
};

export default getReferralLetterData;
