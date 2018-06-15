import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import config from "../../config/config";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";

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

    const response = await fetch(
      `${hostname}/api/cases/${caseId}/cases-officers/${caseOfficerId}/officers-allegations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formValues)
      }
    );

    switch (response.status) {
      case 201:
        addAllegationSuccessCallback();
        return dispatch(snackbarSuccess(successMessage));
      case 401:
        return dispatch(push(`/login`));
      case 500:
        return dispatch(snackbarError(errorMessage));
      default:
        return dispatch(snackbarError(errorMessage));
    }
  } catch (error) {
    return dispatch(snackbarError(errorMessage));
  }
};

export default createOfficerAllegation;
