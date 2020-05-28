import { updateNarrativeSuccess } from "../../actionCreators/casesActionCreators";
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
    return dispatch(snackbarSuccess("Narrative was successfully updated"));
  } catch (e) {}
};

export default updateNarrative;
