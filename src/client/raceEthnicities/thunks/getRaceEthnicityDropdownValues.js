import axios from "axios";
import { getRaceEthnicitiesSuccess } from "../../actionCreators/raceEthnicityActionCreators";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

const getRaceEthnicityDropdownValues = () => async dispatch => {
  try {
    const response = await axios.get(`api/race-ethnicities`);
    return dispatch(getRaceEthnicitiesSuccess(response.data));
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and the race & ethnicities were not loaded. Please try again."
      )
    );
  }
};

export default getRaceEthnicityDropdownValues;
