import axios from "axios/index";
import { getLetterTypeSuccess } from "../../../actionCreators/letterActionCreators";

const getLetterType = caseId => async dispatch => {
  try {
    const letterTypeResponse = await axios.get(
      `api/cases/${caseId}/referral-letter/letter-type`
    );
    return dispatch(getLetterTypeSuccess(letterTypeResponse.data.letterType));
  } catch (error) {}
};

export default getLetterType;
