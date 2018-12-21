import axios from "axios";
import config from "../../config/config";
import { getIntakeSourcesSuccess } from "../../actionCreators/intakeSourceActionCreators";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

const getIntakeSourceDropdownValues = () => async dispatch => {
  const hostname = config[process.env.NODE_ENV].hostname;
  try {
    const response = await axios.get(`${hostname}/api/intake-sources`);
    return dispatch(getIntakeSourcesSuccess(response.data));
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and the intake sources were not loaded. Please try again."
      )
    );
  }
};

export default getIntakeSourceDropdownValues;
