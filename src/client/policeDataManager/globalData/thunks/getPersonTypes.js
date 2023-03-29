import axios from "axios/index";
import { GET_PERSON_TYPES } from "../../../../sharedUtilities/constants";

const getPersonTypes = () => async dispatch => {
  try {
    const response = await axios.get("/api/person-types");
    return dispatch({
      type: GET_PERSON_TYPES,
      payload: response.data
    });
  } catch (error) {}
};

export default getPersonTypes;
