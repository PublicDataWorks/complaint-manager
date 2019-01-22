import { updateNarrativeSuccess } from "../../actionCreators/casesActionCreators";
import getCaseNotes from "./getCaseNotes";
import axios from "axios";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

const updateNarrative = updateDetails => async dispatch => {
  try {
    const response = await axios.put(
      `api/cases/${updateDetails.id}/narrative`,
      JSON.stringify({
        narrativeSummary: updateDetails.narrativeSummary,
        narrativeDetails: updateDetails.narrativeDetails
      })
    );

    dispatch(updateNarrativeSuccess(response.data));
    dispatch(snackbarSuccess("Narrative was successfully updated"));
    return await dispatch(getCaseNotes(response.data.id));
  } catch (e) {}
};

export default updateNarrative;
