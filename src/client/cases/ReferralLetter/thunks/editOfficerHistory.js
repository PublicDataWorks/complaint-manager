import { push } from "react-router-redux";
import axios from "axios/index";
import {
  snackbarError,
  snackbarSuccess
} from "../../../actionCreators/snackBarActionCreators";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const editOfficerHistory = (
  caseId,
  letterValues,
  successRedirectRoute
) => async dispatch => {
  try {
    await axios.put(
      `api/cases/${caseId}/referral-letter/officer-history`,
      letterValues
    );
    dispatch(
      snackbarSuccess("Officer complaint history was successfully updated")
    );
    return dispatch(push(successRedirectRoute));
  } catch (error) {}
};

export default editOfficerHistory;
