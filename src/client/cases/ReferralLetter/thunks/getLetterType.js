import axios from "axios/index";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import { getLetterTypeSuccess } from "../../../actionCreators/letterActionCreators";

const getLetterType = caseId => async dispatch => {
  try {
    const letterTypeResponse = await axios.get(
      `api/cases/${caseId}/referral-letter/letter-type`
    );
    return dispatch(getLetterTypeSuccess(letterTypeResponse.data.letterType));
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and the referral letter details were not loaded. Please try again."
      )
    );
  }
};

export default getLetterType;
