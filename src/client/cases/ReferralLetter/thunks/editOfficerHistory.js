import getAccessToken from "../../../auth/getAccessToken";
import { push } from "react-router-redux";
import config from "../../../config/config";
import axios from "axios/index";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";

const editOfficerHistory = (
  caseId,
  letterValues,
  successRedirectRoute
) => async dispatch => {
  const token = getAccessToken();
  if (!token) {
    return dispatch(push("/login"));
  }
  try {
    const hostname = config[process.env.NODE_ENV].hostname;
    await axios(
      `${hostname}/api/cases/${caseId}/referral-letter/officer-history`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: letterValues
      }
    );
    dispatch(
      snackbarSuccess("Officer complaint history was successfully updated")
    );
    return dispatch(push(successRedirectRoute));
  } catch (error) {
    if (error.response.data.message === "Invalid case status") {
      return dispatch(push(`/cases/${caseId}`));
    }
    dispatch(
      snackbarError(
        "Something went wrong and the officer history was not updated. Please try again."
      )
    );
  }
};

export default editOfficerHistory;
