import config from "../../config/config";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";
import { createOfficerAllegationSuccess } from "../../actionCreators/allegationsActionCreators";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const createOfficerAllegation = (
  formValues,
  caseId,
  caseOfficerId,
  addAllegationSuccessCallback
) => async dispatch => {
  try {
    const response = await axios.post(
      `${hostname}/api/cases/${caseId}/cases-officers/${caseOfficerId}/officers-allegations`,
      JSON.stringify(formValues)
    );
    addAllegationSuccessCallback();
    dispatch(createOfficerAllegationSuccess(response.data));
    return dispatch(snackbarSuccess("Allegation was successfully added"));
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and the allegation was not added. Please try again."
      )
    );
  }
};

export default createOfficerAllegation;
