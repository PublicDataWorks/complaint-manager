import getAccessToken from "../../../auth/getAccessToken";
import saveAs from "file-saver";
import { push } from "react-router-redux";
import axios from "axios";
import config from "../../../config/config";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import { stopLetterDownload } from "../../../actionCreators/letterActionCreators";

const hostname = config[process.env.NODE_ENV].hostname;

const generatePdf = (caseId, edited) => async dispatch => {
  const editPrefix = edited ? "Edited" : "Generated";
  const filename = `${caseId} - ${editPrefix} Preview Letter.pdf`;
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

    dispatch(stopLetterDownload());
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
