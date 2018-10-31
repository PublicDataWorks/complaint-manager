import getAccessToken from "../../../auth/getAccessToken";
import { push } from "react-router-redux";
import axios from "axios/index";
import { getLetterPreviewSuccess } from "../../../actionCreators/letterActionCreators";
import config from "../../../config/config";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";

const getLetterPreview = caseId => async dispatch => {
  const token = getAccessToken();
  if (!token) {
    return dispatch(push("/login"));
  }
  try {
    const hostname = config[process.env.NODE_ENV].hostname;
    const response = await axios(
      `${hostname}/api/cases/${caseId}/referral-letter/preview`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );
    return dispatch(
      getLetterPreviewSuccess(response.data.letterHtml, response.data.addresses)
    );
  } catch (error) {
    dispatch(
      snackbarError(
        "Something went wrong and the letter preview was not loaded. Please try again."
      )
    );
  }
};

export default getLetterPreview;
