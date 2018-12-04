import getAccessToken from "../../../auth/getAccessToken";
import saveAs from "file-saver";
import { push } from "react-router-redux";
import axios from "axios";
import config from "../../../config/config";
import moment from "moment";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import {
  getLetterPdfSuccess,
  stopLetterDownload
} from "../../../actionCreators/letterActionCreators";
import { CIVILIAN_INITIATED } from "../../../../sharedUtilities/constants";

const hostname = config[process.env.NODE_ENV].hostname;

const getPdf = (
  caseDetail,
  letterType,
  saveFileForUser = false
) => async dispatch => {
  const token = getAccessToken();
  if (!token) {
    return dispatch(push("/login"));
  }
  try {
    const response = await axios.get(
      `${hostname}/api/cases/${caseDetail.id}/referral-letter/get-pdf`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: "arraybuffer"
      }
    );

    if (saveFileForUser) {
      const filename = determineFilename(caseDetail, letterType);
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

const determineFilename = (caseDetail, letterType) => {
  const formattedFirstContactDate = moment(caseDetail.firstContactDate).format(
    "MM-DD-YYYY"
  );
  const firstComplainant =
    caseDetail.complaintType === CIVILIAN_INITIATED
      ? caseDetail.complainantCivilians[0]
      : caseDetail.complainantOfficers[0];
  const complainantLastName = firstComplainant
    ? `_${firstComplainant.lastName}`
    : "";
  return `${formattedFirstContactDate}_${
    caseDetail.caseNumber
  }_${letterType}_Referral_Draft${complainantLastName}.pdf`;
};

export default getPdf;
