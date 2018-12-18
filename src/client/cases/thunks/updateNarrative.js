import {
  updateNarrativeFailure,
  updateNarrativeSuccess
} from "../../actionCreators/casesActionCreators";
import config from "../../config/config";
import getCaseNotes from "./getCaseNotes";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const updateNarrative = updateDetails => async dispatch => {
  try {
    const response = await axios.put(
      `${hostname}/api/cases/${updateDetails.id}/narrative`,
      JSON.stringify({
        narrativeSummary: updateDetails.narrativeSummary,
        narrativeDetails: updateDetails.narrativeDetails
      })
    );

    dispatch(updateNarrativeSuccess(response.data));
    return await dispatch(getCaseNotes(response.data.id));
  } catch (e) {
    return dispatch(updateNarrativeFailure());
  }
};

export default updateNarrative;
