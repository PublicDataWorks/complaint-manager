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
  EMPLOYEE_TYPE,
  OFFICER_TITLE
} from "../../../../sharedUtilities/constants";
import { CIVILIAN_WITHIN_PD_TITLE } from "../../../../instance-files/constants";

const addOfficer = (
  caseId,
  officerId,
  caseEmployeeType,
  values
) => async dispatch => {
  const payload = { officerId, caseEmployeeType, ...values };
  const isCivilianWithinNopd =
    caseEmployeeType === EMPLOYEE_TYPE.CIVILIAN_WITHIN_PD;
  const caseEmployeeTitle = isCivilianWithinNopd
    ? CIVILIAN_WITHIN_PD_TITLE
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
