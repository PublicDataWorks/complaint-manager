import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import {
  addCaseNoteFailure,
  addCaseNoteSuccess,
  closeCaseNoteDialog
} from "../../actionCreators/casesActionCreators";
import config from "../../config/config";

const hostname = config[process.env.NODE_ENV].hostname;

const addCaseNote = values => async dispatch => {
  try {
    const token = getAccessToken();

    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await fetch(
      `${hostname}/api/cases/${values.caseId}/recent-activity`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(values)
      }
    );

    switch (response.status) {
      case 201:
        const data = await response.json();
        dispatch(addCaseNoteSuccess(data.caseDetails, data.recentActivity));
        return dispatch(closeCaseNoteDialog());
      case 401:
        return dispatch(push("/login"));
      case 500:
        return dispatch(addCaseNoteFailure());
      default:
        return dispatch(addCaseNoteFailure());
    }
  } catch (error) {
    return dispatch(addCaseNoteFailure());
  }
};

export default addCaseNote;
