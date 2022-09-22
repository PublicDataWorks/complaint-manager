import axios from "axios/index";
import { GET_SIGNERS } from "../../../../sharedUtilities/constants";

const getSigners = () => async dispatch => {
  try {
    const response = await axios.get("api/signers");
    return dispatch({
      type: GET_SIGNERS,
      payload: response.data
    });
  } catch (error) {}
};

export default getSigners;
