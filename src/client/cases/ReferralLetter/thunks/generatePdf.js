import getAccessToken from "../../../auth/getAccessToken";
import saveAs from "file-saver";
import { push } from "react-router-redux";
import axios from "axios";
import config from "../../../config/config";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import {
  getLetterPdfSuccess,
  stopLetterDownload
} from "../../../actionCreators/letterActionCreators";

const hostname = config[process.env.NODE_ENV].hostname;

const generatePdf = (
  caseId,
  edited,
  saveFileForUser = false
) => async dispatch => {
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
        responseType: "arraybuffer"
      }
    );

    if (saveFileForUser) {
      const editPrefix = edited ? "Edited" : "Generated";
      const filename = `${caseId} - ${editPrefix} Preview Letter.pdf`;
      const fileToDownload = new File([response.data], filename);
      dispatch(stopLetterDownload());
      saveAs(fileToDownload, filename);
    } else {
      dispatch(getLetterPdfSuccess(response.data));
    }
  } catch (e) {
    dispatch(stopLetterDownload());
    return dispatch(
      snackbarError(
        "Something went wrong and the letter was not downloaded. Please try again."
      )
    );
  }
};

export default generatePdf;
