import getAccessToken from "../../../auth/getAccessToken";
import saveAs from "file-saver";
import { push } from "react-router-redux";
import axios from "axios";
import config from "../../../config/config";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";

const hostname = config[process.env.NODE_ENV].hostname;

const generatePdf = caseId => async dispatch => {
  const filename = "Preview_Letter.pdf";
  if (!getAccessToken()) {
    return dispatch(push("/login"));
  }
  try {
    const response = await axios.get(
      `${hostname}/api/cases/${caseId}/referral-letter/generate-pdf`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        },
        responseType: "blob"
      }
    );

    const fileToDownload = new File([response.data], filename);

    saveAs(fileToDownload, filename);
  } catch (e) {
    return dispatch(
      snackbarError(
        "Something went wrong and the letter was not downloaded. Please try again."
      )
    );
  }
};

export default generatePdf;
