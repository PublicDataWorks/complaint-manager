import axios from "axios/index";
import { getRecommendedActionsSuccess } from "../../../actionCreators/letterActionCreators";

const getRecommendedActions = () => async dispatch => {
  try {
    const response = await axios.get(`api/recommended-actions`);
    return dispatch(getRecommendedActionsSuccess(response.data));
  } catch (error) {}
};

export default getRecommendedActions;
