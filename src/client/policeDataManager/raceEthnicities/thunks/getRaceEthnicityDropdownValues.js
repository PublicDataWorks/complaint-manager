import axios from "axios";
import { getRaceEthnicitiesSuccess } from "../../actionCreators/raceEthnicityActionCreators";

const getRaceEthnicityDropdownValues = () => async dispatch => {
  try {
    const response = await axios.get(`api/race-ethnicities`);
    return dispatch(getRaceEthnicitiesSuccess(response.data));
  } catch (error) {}
};

export default getRaceEthnicityDropdownValues;
