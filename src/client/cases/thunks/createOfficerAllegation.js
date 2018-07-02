import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
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
  const errorMessage =
    "Something went wrong on our end and your allegation was not added. Please try again.";
  const successMessage = "Allegation successfully added to officer.";

  try {
    const token = getAccessToken();

    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await axios(
      `${hostname}/api/cases/${caseId}/cases-officers/${caseOfficerId}/officers-allegations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(formValues)
      }
    );

    addAllegationSuccessCallback();
    dispatch(createOfficerAllegationSuccess(response.data));
    return dispatch(snackbarSuccess(successMessage));
  } catch (error) {
    return dispatch(snackbarError(errorMessage));
  }
};

export default createOfficerAllegation;
