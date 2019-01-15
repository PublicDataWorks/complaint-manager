import axios from "axios/index";
import { getLetterPreviewSuccess } from "../../../actionCreators/letterActionCreators";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import invalidCaseStatusRedirect from "../../thunks/invalidCaseStatusRedirect";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

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
  } catch (error) {
    if (
      error.response &&
      error.response.data.message === BAD_REQUEST_ERRORS.INVALID_CASE_STATUS
    ) {
      return dispatch(invalidCaseStatusRedirect(caseId));
    }
    dispatch(
      snackbarError(
        "Something went wrong and the letter preview was not loaded. Please try again."
      )
    );
  }
};

export default getLetterPreview;
