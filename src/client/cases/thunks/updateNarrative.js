import {
  updateNarrativeFailure,
  updateNarrativeSuccess
} from "../../actionCreators/casesActionCreators";
import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import config from "../../config/config";
import getCaseNotes from "./getCaseNotes";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const updateNarrative = updateDetails => async dispatch => {
  try {
    const token = getAccessToken();

    if (!token) {
      dispatch(push(`/login`));
      return dispatch(updateNarrativeFailure());
    }

    const response = await axios(
      `${hostname}/api/cases/${updateDetails.id}/narrative`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: JSON.stringify({
          narrativeSummary: updateDetails.narrativeSummary,
          narrativeDetails: updateDetails.narrativeDetails
        })
      }
    );

    dispatch(updateNarrativeSuccess(response.data));
    return await dispatch(getCaseNotes(response.data.id));
  } catch (e) {
    return dispatch(updateNarrativeFailure());
  }
};

export default updateNarrative;
