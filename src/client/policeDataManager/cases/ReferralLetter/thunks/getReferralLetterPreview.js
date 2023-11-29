import axios from "axios/index";
import { getReferralLetterPreviewSuccess } from "../../../actionCreators/letterActionCreators";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";

const getReferralLetterPreview = caseId => async dispatch => {
  try {
    const response = await axios.get(
      `api/cases/${caseId}/referral-letter/preview`
    );
    if (
      response.data.addresses.sender &&
      response.data.addresses.sender.substring(
        response.data.addresses.sender.length - 4,
        response.data.addresses.sender.length
      ) === "null"
    ) {
      response.data.addresses.sender = response.data.addresses.sender.substring(
        0,
        response.data.addresses.sender.length - 5
      );
    }
    dispatch(getCaseDetailsSuccess(response.data.caseDetails));
    return dispatch(
      getReferralLetterPreviewSuccess(
        response.data.letterHtml,
        response.data.addresses,
        response.data.editStatus,
        response.data.lastEdited,
        response.data.finalFilename,
        response.data.draftFilename
      )
    );
  } catch (error) {}
};

export default getReferralLetterPreview;
