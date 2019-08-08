import { push } from "connected-react-router";
import {
  addOfficerToCaseSuccess,
  clearSelectedOfficer
} from "../../actionCreators/officersActionCreators";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import axios from "axios";
import { startSubmit, stopSubmit } from "redux-form";
import { OFFICER_DETAILS_FORM_NAME } from "../../../sharedUtilities/constants";

const addOfficer = (caseId, officerId, values) => async dispatch => {
  const payload = { officerId, ...values };

  try {
    dispatch(startSubmit(OFFICER_DETAILS_FORM_NAME));
    const response = await axios.post(
      `api/cases/${caseId}/cases-officers`,
      JSON.stringify(payload)
    );
    dispatch(addOfficerToCaseSuccess(response.data));
    dispatch(clearSelectedOfficer());
    dispatch(snackbarSuccess(`Officer was successfully added`));
    dispatch(push(`/cases/${caseId}`));
    dispatch(stopSubmit(OFFICER_DETAILS_FORM_NAME));
  } catch (e) {}
};
export default addOfficer;
