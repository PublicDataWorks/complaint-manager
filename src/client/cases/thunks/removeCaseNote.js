import getAccessToken from "../../auth/getAccessToken";
import {
  closeRemoveCaseNoteDialog,
  removeCaseNoteFailure,
  removeCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";
import config from "../../config/config";
import { push } from "react-router-redux";

const hostname = config[process.env.NODE_ENV].hostname;

const removeCaseNote = (caseId, caseNoteId) => async dispatch => {
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await fetch(
      `${hostname}/api/cases/${caseId}/recent-activity/${caseNoteId}`,
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
        dispatch(closeRemoveCaseNoteDialog());
        const currentCase = await response.json();
        return dispatch(removeCaseNoteSuccess(currentCase));
      case 500:
        return dispatch(removeCaseNoteFailure());
      case 401:
        return dispatch(push("/login"));
      default:
        return dispatch(removeCaseNoteFailure());
    }
  } catch (error) {
    return dispatch(removeCaseNoteFailure());
  }
};

export default removeCaseNote;
