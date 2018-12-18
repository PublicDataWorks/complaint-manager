import { push } from "react-router-redux";
import config from "../../../config/config";
import axios from "axios/index";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";

const editOfficerHistory = (
  caseId,
  letterValues,
  successRedirectRoute
) => async dispatch => {
  try {
    const hostname = config[process.env.NODE_ENV].hostname;
    await axios.put(
      `${hostname}/api/cases/${caseId}/referral-letter/officer-history`,
      letterValues
    );
    dispatch(
      snackbarSuccess("Officer complaint history was successfully updated")
    );
    return dispatch(push(successRedirectRoute));
  } catch (error) {
    if (
      error.response &&
      error.response.data.message === "Invalid case status"
    ) {
      return dispatch(push(`/cases/${caseId}`));
    }
    dispatch(
      snackbarError(
        "Something went wrong and the officer history was not updated. Please try again."
      )
    );
  }
};

export default editOfficerHistory;
