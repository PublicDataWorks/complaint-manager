import { getDistrictsSuccess } from "../../actionCreators/districtsActionCreators";
import axios from "axios";

const getDistrictDropdownValues = () => async dispatch => {
  try {
    const response = await axios.get(`api/districts`);
    return dispatch(getDistrictsSuccess(response.data));
  } catch (error) {}
};

export default getDistrictDropdownValues;
