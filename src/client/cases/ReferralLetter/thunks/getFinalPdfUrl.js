import config from "../../../config/config";
import axios from "axios";
import { getFinalPdfUrlSuccess } from "../../../actionCreators/letterActionCreators";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";

const getFinalPdfUrl = caseId => async dispatch => {
  const hostname = config[process.env.NODE_ENV].hostname;
  try {
    const response = await axios.get(
      `${hostname}/api/cases/${caseId}/referral-letter/final-pdf-url`
    );
    dispatch(getFinalPdfUrlSuccess(response.data));
  } catch (error) {
    dispatch(
      snackbarError(
        "Something went wrong and the letter was not downloaded. Please try again."
      )
    );
  }
};

export default getFinalPdfUrl;
