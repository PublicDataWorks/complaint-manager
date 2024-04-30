import axios from "axios";
import { startSubmit, stopSubmit } from "redux-form";
import { REASSIGN_CASE_FORM_NAME } from "../../../../sharedUtilities/constants";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import getCaseDetails from "./getCaseDetails";

const   updateCase = values => async dispatch => {
  try {
    dispatch(startSubmit(REASSIGN_CASE_FORM_NAME));
    await axios.put(`api/cases/${values.id}`, values);
    dispatch(stopSubmit(REASSIGN_CASE_FORM_NAME));
    dispatch(getCaseDetails(values.id));
    dispatch(snackbarSuccess("Case was successfully updated"));
  } catch (error) {
    console.log(error);
    dispatch(stopSubmit(REASSIGN_CASE_FORM_NAME));
  }
};

export default updateCase;
