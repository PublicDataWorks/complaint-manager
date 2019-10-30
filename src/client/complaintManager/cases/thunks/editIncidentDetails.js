import { updateIncidentDetailsSuccess } from "../../actionCreators/casesActionCreators";
import getCaseNotes from "./getCaseNotes";
import axios from "axios";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

const editIncidentDetails = (
  incidentDetails,
  closeDialogCallback
) => async dispatch => {
  try {
    const response = await axios.put(
      `api/cases/${incidentDetails.id}`,
      JSON.stringify(incidentDetails)
    );
    closeDialogCallback();
    dispatch(updateIncidentDetailsSuccess(response.data));
    dispatch(snackbarSuccess("Incident details were successfully updated"));
    return await dispatch(getCaseNotes(response.data.id));
  } catch (error) {}
};

export default editIncidentDetails;
