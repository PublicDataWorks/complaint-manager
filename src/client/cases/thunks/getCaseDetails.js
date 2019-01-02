import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import config from "../../config/config";
import axios from "axios";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

const hostname = config[process.env.NODE_ENV].hostname;

const getCaseDetails = caseId => async dispatch => {
  try {
    const response = await axios.get(`${hostname}/api/cases/${caseId}`);
    return dispatch(getCaseDetailsSuccess(response.data));
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and the case details were not loaded. Please try again."
      )
    );
  }
};

export default getCaseDetails;
