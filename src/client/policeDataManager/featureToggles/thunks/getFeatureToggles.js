import axios from "axios/index";
import { getFeaturesSuccess } from "../../actionCreators/featureTogglesActionCreators";
import allConfigs from "../../../common/config/config";

const getFeatureToggles = () => async dispatch => {
  try {
    const response = await axios.get(
      `${allConfigs[process.env.REACT_APP_ENV].backendUrl}/features`
    );
    return dispatch(getFeaturesSuccess(response.data));
  } catch (error) {}
};

export default getFeatureToggles;
