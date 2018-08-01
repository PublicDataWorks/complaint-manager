import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import config from "../../config/config";
import axios from "axios/index";
import { getFeaturesSuccess } from "../../actionCreators/featureTogglesActionCreators";

const hostname = config[process.env.NODE_ENV].hostname;

const getFeatureToggles = () => async dispatch => {
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await axios(`${hostname}/features`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    return dispatch(getFeaturesSuccess(response.data));
  } catch (error) {}
};

export default getFeatureToggles;
