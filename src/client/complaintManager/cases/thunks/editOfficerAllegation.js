import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { updateAllegationDetailsSuccess } from "../../actionCreators/casesActionCreators";
import axios from "axios";

const editOfficerAllegation = (allegation, caseId) => async dispatch => {
  try {
    const response = await axios.put(
      `api/cases/${caseId}/officers-allegations/${allegation.id}`,
      JSON.stringify(allegation)
    );
    dispatch(updateAllegationDetailsSuccess(allegation.id, response.data));
    return dispatch(snackbarSuccess("Allegation was successfully updated"));
  } catch (error) {}
};

export default editOfficerAllegation;
