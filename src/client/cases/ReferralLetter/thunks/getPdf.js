import saveAs from "file-saver";
import axios from "axios";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import {
  getLetterPdfSuccess,
  stopLetterDownload
} from "../../../actionCreators/letterActionCreators";

const getPdf = (
  caseId,
  filename,
  letterType,
  saveFileForUser = false
) => async dispatch => {
  try {
    const response = await axios.get(
      `api/cases/${caseId}/referral-letter/get-pdf`,
      {responseType: "arraybuffer"}
    );

    if (saveFileForUser) {
      const fileToDownload = new File([response.data], filename);
      saveAs(fileToDownload, filename);
    } else {
      dispatch(getLetterPdfSuccess(response.data));
    }
    dispatch(stopLetterDownload());
  } catch (e) {
    dispatch(stopLetterDownload());
    return dispatch(
      snackbarError(
        "Something went wrong and the letter was not downloaded. Please try again."
      )
    );
  }
};

export default getPdf;
