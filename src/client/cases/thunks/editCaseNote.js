import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import {
  closeCaseNoteDialog,
  editCaseNoteFailure,
  editCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";
import config from "../../config/config";

const hostname = config[process.env.NODE_ENV].hostname;

const editCaseNote = values => async dispatch => {
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await fetch(
      `${hostname}/api/cases/${values.caseId}/recent-activity/${values.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(values)
      }
    );

    switch (response.status) {
      case 200:
        const recentActivity = await response.json();
        dispatch(editCaseNoteSuccess(recentActivity));
        return dispatch(closeCaseNoteDialog());
      case 401:
        return dispatch(push("/login"));
      case 500:
        return dispatch(editCaseNoteFailure());
      default:
        return dispatch(editCaseNoteFailure());
    }
  } catch (error) {
    return dispatch(editCaseNoteFailure());
  }
};

export default editCaseNote;
