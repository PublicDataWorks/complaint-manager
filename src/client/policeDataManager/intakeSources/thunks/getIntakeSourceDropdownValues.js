import axios from "axios";
import { getIntakeSourcesSuccess } from "../../actionCreators/intakeSourceActionCreators";

const getIntakeSourceDropdownValues = () => async dispatch => {
  try {
    const response = await axios.get(`api/intake-sources`);
    return dispatch(getIntakeSourcesSuccess(response.data));
  } catch (error) {}
};

export default getIntakeSourceDropdownValues;
