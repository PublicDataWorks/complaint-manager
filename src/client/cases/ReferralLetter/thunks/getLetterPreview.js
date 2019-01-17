import axios from "axios/index";
import { getLetterPreviewSuccess } from "../../../actionCreators/letterActionCreators";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";

const getLetterPreview = caseId => async dispatch => {
  try {
    const response = await axios.get(
      `api/cases/${caseId}/referral-letter/preview`
    );
    dispatch(getCaseDetailsSuccess(response.data.caseDetails));
    return dispatch(
      getLetterPreviewSuccess(
        response.data.letterHtml,
        response.data.addresses,
        response.data.letterType,
        response.data.lastEdited,
        response.data.finalFilename,
        response.data.draftFilename
      )
    );
  } catch (error) {}
};

export default getLetterPreview;
