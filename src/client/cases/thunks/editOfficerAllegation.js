import config from "../../config/config";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";
import { updateAllegationDetailsSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const editOfficerAllegation = allegation => async dispatch => {
  try {
    const response = await axios.put(
      `${hostname}/api/officers-allegations/${allegation.id}`,
      JSON.stringify(allegation)
    );
    dispatch(updateAllegationDetailsSuccess(allegation.id, response.data));
    return dispatch(snackbarSuccess("Allegation was successfully updated"));
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and the allegation was not updated. Please try again."
      )
    );
  }
};

export default editOfficerAllegation;
