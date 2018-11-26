import getAccessToken from "../../../auth/getAccessToken";
import { push } from "react-router-redux";
import axios from "axios/index";
import config from "../../../config/config";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";

const approveReferralLetter = (caseId, callback) => async dispatch => {
  const token = getAccessToken();
  if (!token) {
    return dispatch(push("/login"));
  }
  try {
    const hostname = config[process.env.NODE_ENV].hostname;

    await axios(
      `${hostname}/api/cases/${caseId}/referral-letter/approve-letter`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );
    dispatch(snackbarSuccess("Case status was successfully updated"));
    dispatch(push(`/cases/${caseId}`));
  } catch (error) {
    if (
      error.response &&
      error.response.data.message === "Invalid case status"
    ) {
      dispatch(
        snackbarError("Case status could not be updated due to invalid status")
      );
      return dispatch(push(`/cases/${caseId}`));
    }
    dispatch(
      snackbarError(
        "Something went wrong and the case status was not updated. Please try again."
      )
    );
  } finally {
    callback();
  }
};

export default approveReferralLetter;
