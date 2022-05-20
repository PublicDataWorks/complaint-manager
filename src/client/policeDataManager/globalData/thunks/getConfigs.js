import axios from "axios/index";
import { GET_CONFIGS_SUCCEEDED } from "../../../../sharedUtilities/constants";

const getConfigs = () => async dispatch => {
  try {
    const response = await axios.get("api/configs");
    return dispatch({
      type: GET_CONFIGS_SUCCEEDED,
      payload: response.data
    });
  } catch (error) {}
};

export default getConfigs;
