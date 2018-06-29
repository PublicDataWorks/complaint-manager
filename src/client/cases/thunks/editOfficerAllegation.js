import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import config from "../../config/config";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";
import { updateAllegationDetailsSuccess } from "../../actionCreators/casesActionCreators";

const hostname = config[process.env.NODE_ENV].hostname;

const editOfficerAllegation = allegation => async dispatch => {
  const token = getAccessToken();

  if (!token) {
    dispatch(push("/login"));
    return;
  }

  try {
    const response = await fetch(
      `${hostname}/api/officers-allegations/${allegation.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(allegation)
      }
    );

    switch (response.status) {
      case 401:
        return dispatch(push("/login"));
      case 200:
        const responseBody = await response.json();
        dispatch(updateAllegationDetailsSuccess(allegation.id, responseBody));
        return dispatch(snackbarSuccess("Allegation successfully updated"));
      default:
        return dispatch(
          snackbarError(
            "Something went wrong on our end and the allegation was not updated."
          )
        );
    }
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong on our end and the allegation was not updated."
      )
    );
  }
};

export default editOfficerAllegation;
