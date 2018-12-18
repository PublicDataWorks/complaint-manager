import config from "../../config/config";
import {
  updateIncidentDetailsFailure,
  updateIncidentDetailsSuccess
} from "../../actionCreators/casesActionCreators";
import getCaseNotes from "./getCaseNotes";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const editIncidentDetails = (
  incidentDetails,
  closeDialogCallback
) => async dispatch => {
  try {
    const response = await axios.put(
      `${hostname}/api/cases/${incidentDetails.id}`,
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
