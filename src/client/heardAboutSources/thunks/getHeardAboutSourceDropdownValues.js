import axios from "axios";
import { getHeardAboutSourcesSuccess } from "../../actionCreators/heardAboutSourceActionCreators";

const getHeardAboutSourceDropdownValues = () => async dispatch => {
  try {
    const response = await axios.get(`api/heard-about-sources`);
    return dispatch(getHeardAboutSourcesSuccess(response.data));
  } catch (error) {}
};

export default getHeardAboutSourceDropdownValues;
