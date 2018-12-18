import { push } from "react-router-redux";
import config from "../../../config/config";
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
    const hostname = config[process.env.NODE_ENV].hostname;
    await axios.put(
      `${hostname}/api/cases/${caseId}/referral-letter/recommended-actions`,
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
