import axios from "axios/index";
import { getMinimumCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

const getMinimumCaseDetails = caseId => async dispatch => {
  try {
    const minimumCaseDetails = await axios.get(
      `api/cases/${caseId}/minimum-case-details`
    );
    dispatch(getMinimumCaseDetailsSuccess(minimumCaseDetails.data));
  } catch (error) {
    dispatch(
      snackbarError(
        "Something went wrong and the case details could not be loaded. Please try again."
      )
    );
  }
};

export default getMinimumCaseDetails;
