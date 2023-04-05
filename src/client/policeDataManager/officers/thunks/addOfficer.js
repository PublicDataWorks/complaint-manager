import { push } from "connected-react-router";
import {
  addOfficerToCaseSuccess,
  clearCaseEmployeeType,
  clearSelectedOfficer
} from "../../actionCreators/officersActionCreators";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import axios from "axios";
import { startSubmit, stopSubmit } from "redux-form";
import {
  OFFICER_DETAILS_FORM_NAME,
  OFFICER_TITLE
} from "../../../../sharedUtilities/constants";

const addOfficer =
  (caseId, officerId, caseEmployeeType, values, pd) => async dispatch => {
    const payload = { officerId, caseEmployeeType, ...values };
    const isCivilianWithinPd = caseEmployeeType.includes("Civilian");
    const caseEmployeeTitle = isCivilianWithinPd
      ? `Civilian (${pd})`
      : OFFICER_TITLE;

    try {
      dispatch(startSubmit(OFFICER_DETAILS_FORM_NAME));
      const response = await axios.post(
        `api/cases/${caseId}/cases-officers`,
        JSON.stringify(payload)
      );
      dispatch(addOfficerToCaseSuccess(response.data));
      dispatch(clearSelectedOfficer());
      dispatch(clearCaseEmployeeType());
      dispatch(snackbarSuccess(`${caseEmployeeTitle} was successfully added`));
      dispatch(push(`/cases/${caseId}`));
      dispatch(stopSubmit(OFFICER_DETAILS_FORM_NAME));
    } catch (e) {}
  };

export default addOfficer;
