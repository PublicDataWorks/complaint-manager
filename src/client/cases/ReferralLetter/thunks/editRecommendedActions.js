import { push } from "react-router-redux";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
import axios from "axios/index";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const editRecommendedActions = (
  caseId,
  recommendedActionValues,
  successRedirectRoute
) => async dispatch => {
  try {
    await axios.put(
      `api/cases/${caseId}/referral-letter/recommended-actions`,
      recommendedActionValues
    );
    dispatch(snackbarSuccess("Recommended actions were successfully updated"));
    return dispatch(push(successRedirectRoute));
  } catch (error) {}
};

export default editRecommendedActions;
