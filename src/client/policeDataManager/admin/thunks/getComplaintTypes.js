import axios from "axios/index";
import { GET_COMPLAINT_TYPES_SUCCEEDED } from "../../../../sharedUtilities/constants";

const getComplaintTypes = () => async dispatch => {
  try {
    const response = await axios.get("api/complaint-types");
    return dispatch({
      type: GET_COMPLAINT_TYPES_SUCCEEDED,
      payload: response.data
    });
  } catch (error) {}
};

export default getComplaintTypes;
