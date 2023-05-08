import { push } from "connected-react-router";
import {
  clearSelectedOfficer,
  editCaseOfficerSuccess
} from "../../actionCreators/officersActionCreators";
import axios from "axios";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { OFFICER_TITLE } from "../../../../sharedUtilities/constants";

const editCaseOfficer =
  (caseId, caseOfficerId, officerId, caseEmployeeType, values, pd) =>
  async dispatch => {
    try {
      const payload = { ...values, officerId };
      const caseEmployeeTitle = caseEmployeeType?.includes("Civilian")
        ? `Civilian (${pd})`
        : OFFICER_TITLE;
      await axios.put(
        `api/cases/${caseId}/cases-officers/${caseOfficerId}`,
        payload
      );
      dispatch(editCaseOfficerSuccess());
      dispatch(
        snackbarSuccess(`${caseEmployeeTitle} was successfully updated`)
      );
      dispatch(clearSelectedOfficer());
      return dispatch(push(`/cases/${caseId}`));
    } catch (error) {}
  };

export default editCaseOfficer;
