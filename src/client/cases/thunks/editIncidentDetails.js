import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
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
    const token = getAccessToken();

    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await axios(
      `${hostname}/api/cases/${incidentDetails.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(incidentDetails)
      }
    );

    closeDialogCallback();
    dispatch(updateIncidentDetailsSuccess(response.data));
    return await dispatch(getCaseNotes(response.data.id));
  } catch (error) {
    return dispatch(updateIncidentDetailsFailure());
  }
};

export default editIncidentDetails;
