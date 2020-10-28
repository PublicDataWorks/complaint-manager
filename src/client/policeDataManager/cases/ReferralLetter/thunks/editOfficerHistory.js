import { push } from "connected-react-router";
import axios from "axios/index";
import { snackbarSuccess } from "../../../actionCreators/snackBarActionCreators";

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
