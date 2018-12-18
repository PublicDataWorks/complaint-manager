import config from "../../config/config";
import axios from "axios/index";
import { getFeaturesSuccess } from "../../actionCreators/featureTogglesActionCreators";

const hostname = config[process.env.NODE_ENV].hostname;

const getFeatureToggles = () => async dispatch => {
  try {
    const response = await axios.get(`${hostname}/features`);
    return dispatch(getFeaturesSuccess(response.data));
  } catch (error) {}
};

export default getFeatureToggles;
