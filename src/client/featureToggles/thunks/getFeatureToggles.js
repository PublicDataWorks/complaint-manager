import axios from "axios/index";
import { getFeaturesSuccess } from "../../actionCreators/featureTogglesActionCreators";

const getFeatureToggles = () => async dispatch => {
  try {
    const response = await axios.get(`features`);
    console.log("got feature toggles");
    return dispatch(getFeaturesSuccess(response.data));
  } catch (error) {}
};

export default getFeatureToggles;
