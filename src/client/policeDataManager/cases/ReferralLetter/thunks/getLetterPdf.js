import saveAs from "file-saver";
import axios from "axios";
import {
  getReferralLetterPdfSuccess,
  stopLetterDownload
} from "../../../actionCreators/letterActionCreators";

const getLetterPdf =
  (
    caseId,
    filename,
    saveFileForUser = false,
    endpoint = "referral-letter/get-pdf"
  ) =>
  async dispatch => {
    try {
      const response = await axios.get(`api/cases/${caseId}/${endpoint}`, {
        responseType: "arraybuffer"
      });

      if (saveFileForUser) {
        const fileToDownload = new File([response.data], filename);
        saveAs(fileToDownload, filename);
      } else {
        // may need to refactor this to  be general or branched depending on
        // letter vs. referralLeter, but it is only used for Review and Approve page
        dispatch(getReferralLetterPdfSuccess(response.data));
      }
      dispatch(stopLetterDownload());
    } catch (error) {
      dispatch(stopLetterDownload());
    }
  };

export default getLetterPdf;
