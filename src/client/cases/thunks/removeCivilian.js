import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import config from "../../config/config";
import {
  closeRemoveCivilianDialog,
  removeCivilianFailure,
  removeCivilianSuccess
} from "../../actionCreators/casesActionCreators";

const hostname = config[process.env.NODE_ENV].hostname;

const removeCivilian = (civilianId, caseId) => async dispatch => {
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await fetch(
      `${hostname}/api/cases/${caseId}/civilians/${civilianId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    switch (response.status) {
      case 200:
        const caseDetails = await response.json();
        dispatch(closeRemoveCivilianDialog());
        return dispatch(removeCivilianSuccess(caseDetails));
      case 401:
        return dispatch(push("/login"));
      case 500:
        return dispatch(removeCivilianFailure());
      default:
        return dispatch(removeCivilianFailure());
    }
  } catch (error) {}
};

export default removeCivilian;
