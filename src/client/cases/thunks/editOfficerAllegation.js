import getAccessToken from "../../auth/getAccessToken";
import { push } from "connected-react-router";
import config from "../../config/config";
import {
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";
import { updateAllegationDetailsSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const editOfficerAllegation = allegation => async dispatch => {
  const token = getAccessToken();

  if (!token) {
    dispatch(push("/login"));
    return;
  }

  try {
    const response = await axios(
      `${hostname}/api/officers-allegations/${allegation.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(allegation)
      }
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
