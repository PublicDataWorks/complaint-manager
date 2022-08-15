import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { createOfficerAllegationSuccess } from "../../actionCreators/allegationsActionCreators";
import axios from "axios";

const createOfficerAllegation =
  (formValues, caseId, caseOfficerId, addAllegationSuccessCallback) =>
  async dispatch => {
    try {
      const response = await axios.post(
        `api/cases/${caseId}/cases-officers/${caseOfficerId}/officers-allegations`,
        formValues
      );
      addAllegationSuccessCallback();
      dispatch(createOfficerAllegationSuccess(response.data));
      return dispatch(snackbarSuccess("Allegation was successfully added"));
    } catch (error) {}
  };

export default createOfficerAllegation;
