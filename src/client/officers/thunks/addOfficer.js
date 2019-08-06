import { push } from "connected-react-router";
import {
  addOfficerToCaseSuccess,
  clearSelectedOfficer
} from "../../actionCreators/officersActionCreators";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import axios from "axios";
import { startSubmit, stopSubmit } from "redux-form";


const addOfficer = (caseId, officerId, values) => async dispatch => {
  const payload = { officerId, ...values };

  try {
    dispatch(startSubmit("OfficerDetails"));
    const response = await axios.post(
      `api/cases/${caseId}/cases-officers`,
      JSON.stringify(payload)
    );
    dispatch(addOfficerToCaseSuccess(response.data));
    dispatch(clearSelectedOfficer());
    dispatch(snackbarSuccess(`Officer was successfully added`));
    dispatch(push(`/cases/${caseId}`));
    dispatch(stopSubmit("OfficerDetails"));
  } catch (e) {}
};
export default addOfficer;
