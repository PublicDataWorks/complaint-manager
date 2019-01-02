import axios from "axios/index";
import { getReferralLetterSuccess } from "../../../actionCreators/letterActionCreators";
import config from "../../../config/config";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";
import { getCaseNumberSuccess } from "../../../actionCreators/casesActionCreators";
import invalidCaseStatusRedirect from "../../thunks/invalidCaseStatusRedirect";

const getReferralLetterData = caseId => async dispatch => {
  try {
    const hostname = config[process.env.NODE_ENV].hostname;
    const response = await axios.get(
      `${hostname}/api/cases/${caseId}/referral-letter`
    );
    const caseNumberResponse = await axios.get(
      `${hostname}/api/cases/${caseId}/case-number`
    );

    dispatch(getCaseNumberSuccess(caseNumberResponse.data));

    return dispatch(getReferralLetterSuccess(response.data));
  } catch (error) {
    if (
      error.response &&
      error.response.data.message === "Invalid case status"
    ) {
      return dispatch(invalidCaseStatusRedirect(caseId));
    }
    dispatch(
      snackbarError(
        "Something went wrong and the page could not be loaded. Please try again."
      )
    );
  }
};

export default getReferralLetterData;
