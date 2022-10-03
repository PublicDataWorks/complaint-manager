import {
  closeEditCivilianDialog,
  editCivilianSuccess
} from "../../actionCreators/casesActionCreators";
import getCaseNotes from "./getCaseNotes";
import axios from "axios";
import { startSubmit, stopSubmit } from "redux-form";
import { CIVILIAN_FORM_NAME } from "../../../../sharedUtilities/constants";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

const editCivilian = civilian => async dispatch => {
  try {
    dispatch(startSubmit(CIVILIAN_FORM_NAME));
    const response = await axios.put(
      `api/cases/${civilian.caseId}/civilians/${civilian.id}`,
      civilian
    );
    dispatch(closeEditCivilianDialog());
    dispatch(editCivilianSuccess(response.data));
    dispatch(snackbarSuccess("Civilian was successfully updated"));
    const event = await dispatch(getCaseNotes(response.data.id));
    dispatch(stopSubmit(CIVILIAN_FORM_NAME));
    return event;
  } catch (e) {
    dispatch(stopSubmit(CIVILIAN_FORM_NAME));
  }
};

export default editCivilian;
