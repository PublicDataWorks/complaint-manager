import { push } from "connected-react-router";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
import axios from "axios/index";

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
  } catch (error) {
    if (
      error.response &&
      error.response.data.message === "Invalid case status"
    ) {
      return dispatch(push(`/cases/${caseId}`));
    }
    dispatch(
      snackbarError(
        "Something went wrong and we could not update the recommended actions information"
      )
    );
  }
};

export default editRecommendedActions;
