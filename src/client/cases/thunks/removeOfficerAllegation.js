import {
  removeOfficerAllegationFailure,
  removeOfficerAllegationSuccess
} from "../../actionCreators/allegationsActionCreators";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";
import axios from "axios/index";

const removeOfficerAllegation = allegationId => async dispatch => {
  try {
    const response = await axios.delete(
      `api/officers-allegations/${allegationId}`
    );
    dispatch(snackbarSuccess("Allegation was successfully removed"));
    return dispatch(removeOfficerAllegationSuccess(response.data));
  } catch (e) {
    dispatch(
      snackbarError(
        "Something went wrong and the allegation was not removed. Please try again."
      )
    );
    return dispatch(removeOfficerAllegationFailure());
  }
};

export default removeOfficerAllegation;
