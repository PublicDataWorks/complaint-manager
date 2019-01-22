import { push } from "connected-react-router";
import { clearSelectedOfficer } from "../../actionCreators/officersActionCreators";
import axios from "axios";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

const editCaseOfficer = (
  caseId,
  caseOfficerId,
  officerId,
  values
) => async dispatch => {
  try {
    const payload = { ...values, officerId };
    await axios.put(
      `api/cases/${caseId}/cases-officers/${caseOfficerId}`,
      JSON.stringify(payload)
    );
    dispatch(snackbarSuccess("Officer was successfully updated"));
    dispatch(clearSelectedOfficer());
    return dispatch(push(`/cases/${caseId}`));
  } catch (error) {}
};

export default editCaseOfficer;
