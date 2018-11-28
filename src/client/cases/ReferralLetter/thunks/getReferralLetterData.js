import getAccessToken from "../../../auth/getAccessToken";
import { push } from "react-router-redux";
import axios from "axios/index";
import { getReferralLetterSuccess } from "../../../actionCreators/letterActionCreators";
import config from "../../../config/config";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";

const getReferralLetterData = caseId => async dispatch => {
  const token = getAccessToken();

  if (!token) {
    return dispatch(push("/login"));
  }

  try {
    const hostname = config[process.env.NODE_ENV].hostname;
    const response = await axios(
      `${hostname}/api/cases/${caseId}/referral-letter`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );
    return dispatch(getReferralLetterSuccess(response.data));
  } catch (error) {
    if (
      error.response &&
      error.response.data.message === "Invalid case status"
    ) {
      return dispatch(push(`/cases/${caseId}`));
    }
    dispatch(
      snackbarError(
        "Something went wrong and the page could not be loaded. Please try again."
      )
    );
  }
};

export default getReferralLetterData;
