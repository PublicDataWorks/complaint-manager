import config from "../../../config/config";
import axios from "axios/index";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import { getRecommendedActionsSuccess } from "../../../actionCreators/letterActionCreators";

const getRecommendedActions = () => async dispatch => {
  const hostname = config[process.env.NODE_ENV].hostname;
  try {
    const response = await axios.get(`${hostname}/api/recommended-actions`);
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
