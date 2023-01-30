import saveAs from "file-saver";
import axios from "axios";
import {
  getReferralLetterPdfSuccess,
  stopLetterDownload
} from "../../../actionCreators/letterActionCreators";

const getReferralLetterPdf =
  (caseId, filename, saveFileForUser = false) =>
  async dispatch => {
    console.log("here comes the Boom");
    try {
      const response = await axios.get(
        `api/cases/${caseId}/referral-letter/get-pdf`,
        { responseType: "arraybuffer" }
      );

      if (saveFileForUser) {
        const fileToDownload = new File([response.data], filename);
        saveAs(fileToDownload, filename);
      } else {
        dispatch(getReferralLetterPdfSuccess(response.data));
      }
      dispatch(stopLetterDownload());
    } catch (error) {
      dispatch(stopLetterDownload());
    }
  };

export default getReferralLetterPdf;
