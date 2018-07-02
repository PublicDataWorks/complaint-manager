import { push } from "react-router-redux";
import config from "../../config/config";
import getAccessToken from "../../auth/getAccessToken";
import {
  removeOfficerAllegationFailure,
  removeOfficerAllegationSuccess
} from "../../actionCreators/allegationsActionCreators";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";

const hostname = config[process.env.NODE_ENV].hostname;

const removeOfficerAllegation = allegationId => async dispatch => {
  const token = getAccessToken();
  if (!token) {
    return dispatch(push("/login"));
  }

  try {
    const response = await fetch(
      `${hostname}/api/officers-allegations/${allegationId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    switch (response.status) {
      case 200:
        const caseDetails = await response.json();
        dispatch(snackbarSuccess("Allegation successfully removed"));
        return dispatch(removeOfficerAllegationSuccess(caseDetails));
      case 401:
        return dispatch(push("/login"));
      case 500:
        dispatch(
          snackbarError(
            "Something went wrong on our end and the allegation was not removed. Please try again."
          )
        );
        return dispatch(removeOfficerAllegationFailure());
      default:
        dispatch(
          snackbarError(
            "Something went wrong on our end and the allegation was not removed. Please try again."
          )
        );
        return dispatch(removeOfficerAllegationFailure());
    }
  } catch (e) {
    dispatch(
      snackbarError(
        "Something went wrong on our end and the allegation was not removed. Please try again."
      )
    );
    return dispatch(removeOfficerAllegationFailure());
  }
};

export default removeOfficerAllegation;
