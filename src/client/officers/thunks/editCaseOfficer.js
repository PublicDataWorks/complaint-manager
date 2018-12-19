import { push } from "connected-react-router";
import config from "../../config/config";
import {
  clearSelectedOfficer,
  editCaseOfficerFailure,
  editCaseOfficerSuccess
} from "../../actionCreators/officersActionCreators";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const editCaseOfficer = (
  caseId,
  caseOfficerId,
  officerId,
  values
) => async dispatch => {
  try {
    const payload = { ...values, officerId };
    const response = await axios.put(
      `${hostname}/api/cases/${caseId}/cases-officers/${caseOfficerId}`,
      JSON.stringify(payload)
    );

    dispatch(editCaseOfficerSuccess(response.data));
    dispatch(clearSelectedOfficer());
    return dispatch(push(`/cases/${caseId}`));
  } catch (error) {
    return dispatch(editCaseOfficerFailure());
  }
};

export default editCaseOfficer;
