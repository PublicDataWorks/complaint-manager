import axios from "axios/index";
import { getFeaturesSuccess } from "../../actionCreators/featureTogglesActionCreators";

const getFeatureToggles = () => async dispatch => {
  try {
    const response = await axios.get(`features`);
    return dispatch(getFeaturesSuccess(response.data));
  } catch (error) {}
};

export default getFeatureToggles;
