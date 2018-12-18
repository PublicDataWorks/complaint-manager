import getAccessToken from "../../auth/getAccessToken";
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
  const token = getAccessToken();

  if (!token) {
    return dispatch(push("/login"));
  }
  try {
    const payload = { ...values, officerId };
    const response = await axios(
      `${hostname}/api/cases/${caseId}/cases-officers/${caseOfficerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(payload)
      }
    );

    dispatch(editCaseOfficerSuccess(response.data));
    dispatch(clearSelectedOfficer());
    return dispatch(push(`/cases/${caseId}`));
  } catch (error) {
    return dispatch(editCaseOfficerFailure());
  }
};

export default editCaseOfficer;
