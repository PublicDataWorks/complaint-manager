import {
  updateIncidentDetailsFailure,
  updateIncidentDetailsSuccess
} from "../../actionCreators/casesActionCreators";
import getCaseNotes from "./getCaseNotes";
import axios from "axios";

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
    return await dispatch(getCaseNotes(response.data.id));
  } catch (error) {
    return dispatch(updateIncidentDetailsFailure());
  }
};

export default editIncidentDetails;
