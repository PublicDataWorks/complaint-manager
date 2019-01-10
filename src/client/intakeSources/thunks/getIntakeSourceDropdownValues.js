import axios from "axios";
import { getIntakeSourcesSuccess } from "../../actionCreators/intakeSourceActionCreators";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

const getIntakeSourceDropdownValues = () => async dispatch => {
  try {
    const response = await axios.get(`api/intake-sources`);
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
