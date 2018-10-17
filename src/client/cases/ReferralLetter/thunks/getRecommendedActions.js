import getAccessToken from "../../../auth/getAccessToken";
import { push } from "react-router-redux";
import config from "../../../config/config";
import axios from "axios/index";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import { getRecommendedActionsSuccess } from "../../../actionCreators/letterActionCreators";

const getRecommendedActions = () => async dispatch => {
  const token = getAccessToken();
  if (!token) {
    return dispatch(push("/login"));
  }
  const hostname = config[process.env.NODE_ENV].hostname;
  try {
    const response = await axios(`${hostname}/api/recommended-actions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    return dispatch(getRecommendedActionsSuccess(response.data));
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and we could not fetch the recommended actions."
      )
    );
  }
};

export default getRecommendedActions;
