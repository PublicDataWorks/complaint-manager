import { push } from "react-router-redux";
import {
  addOfficerToCaseSuccess,
  clearSelectedOfficer
} from "../../actionCreators/officersActionCreators";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import axios from "axios";

const addOfficer = (caseId, officerId, values) => async dispatch => {
  const payload = { officerId, ...values };

  try {
    const response = await axios.post(
      `api/cases/${caseId}/cases-officers`,
      JSON.stringify(payload)
    );
    dispatch(addOfficerToCaseSuccess(response.data));
    dispatch(clearSelectedOfficer());
    dispatch(snackbarSuccess(`Officer was successfully added`));
    dispatch(push(`/cases/${caseId}`));
  } catch (e) {}
};
export default addOfficer;
