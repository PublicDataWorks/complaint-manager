import { push } from "connected-react-router";
import {
  editCaseOfficerFailure,
  editCaseOfficerSuccess
} from "../../actionCreators/officersActionCreators";
import axios from "axios";

const editCaseOfficer = (
  caseId,
  caseOfficerId,
  officerId,
  values
) => async dispatch => {
  try {
    const payload = { ...values, officerId };
    const response = await axios.put(
      `api/cases/${caseId}/cases-officers/${caseOfficerId}`,
      JSON.stringify(payload)
    );
    dispatch(editCaseOfficerSuccess(response.data));
    return dispatch(push(`/cases/${caseId}`));
  } catch (error) {
    return dispatch(editCaseOfficerFailure());
  }
};

export default editCaseOfficer;
