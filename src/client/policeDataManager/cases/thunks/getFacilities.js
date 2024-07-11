import axios from "axios";
import { GET_FACILITIES } from "../../../../sharedUtilities/constants";

const getFacilities = expand => async dispatch => {
  try {
    const response = await axios.get(
      expand ? `api/facilities?expand=${expand}` : "api/facilities"
    );
    dispatch({
      type: GET_FACILITIES,
      payload: response.data
    });
  } catch (error) {}
};

export default getFacilities;
