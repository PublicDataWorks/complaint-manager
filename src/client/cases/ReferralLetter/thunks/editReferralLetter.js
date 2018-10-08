import getAccessToken from "../../../auth/getAccessToken";
import { push } from "react-router-redux";
import config from "../../../config/config";
import axios from "axios/index";
import { editReferralLetterSuccess } from "../../../actionCreators/letterActionCreators";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";

const editReferralLetter = (
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
    const response = await axios(
      `${hostname}/api/cases/${caseId}/referral-letter`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: letterValues
      }
    );
    dispatch(editReferralLetterSuccess(response.data));
    return dispatch(push(successRedirectRoute));
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and we could not update the referral letter information"
      )
    );
  }
};

export default editReferralLetter;
