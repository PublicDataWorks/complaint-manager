import getAccessToken from "../../../auth/getAccessToken";
import { push } from "react-router-redux";
import { editRecommendedActionsSuccess } from "../../../actionCreators/letterActionCreators";
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
  const token = getAccessToken();
  if (!token) {
    return dispatch(push("/login"));
  }
  try {
    const hostname = config[process.env.NODE_ENV].hostname;
    const response = await axios(
      `${hostname}/api/cases/${caseId}/referral-letter/recommended-actions`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: recommendedActionValues
      }
    );
    dispatch(editRecommendedActionsSuccess(response.data));
    dispatch(snackbarSuccess("Recommended Actions were successfully updated"));
    return dispatch(push(successRedirectRoute));
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and we could not update the Recommended Actions information"
      )
    );
  }
};

export default editRecommendedActions;
