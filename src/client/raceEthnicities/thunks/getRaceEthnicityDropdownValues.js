import axios from "axios";
import config from "../../config/config";
import { getRaceEthnicitiesSuccess } from "../../actionCreators/raceEthnicityActionCreators";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

const getRaceEthnicityDropdownValues = () => async dispatch => {
  const hostname = config[process.env.REACT_APP_ENV].hostname;

  try {
    const response = await axios.get(`${hostname}/api/race-ethnicities`);
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
