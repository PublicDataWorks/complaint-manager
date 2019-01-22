import { removeOfficerAllegationSuccess } from "../../actionCreators/allegationsActionCreators";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import axios from "axios/index";

const removeOfficerAllegation = allegationId => async dispatch => {
  try {
    const response = await axios.delete(
      `api/officers-allegations/${allegationId}`
    );
    dispatch(snackbarSuccess("Allegation was successfully removed"));
    return dispatch(removeOfficerAllegationSuccess(response.data));
  } catch (e) {}
};

export default removeOfficerAllegation;
