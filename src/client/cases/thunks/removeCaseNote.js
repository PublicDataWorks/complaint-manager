import getAccessToken from "../../auth/getAccessToken";
import {
  closeRemoveCaseNoteDialog,
  removeCaseNoteFailure,
  removeCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";
import config from "../../config/config";
import { push } from "react-router-redux";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const removeCaseNote = (caseId, caseNoteId) => async dispatch => {
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await axios(
      `${hostname}/api/cases/${caseId}/recent-activity/${caseNoteId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    dispatch(closeRemoveCaseNoteDialog());
    return dispatch(removeCaseNoteSuccess(response.data));
  } catch (error) {
    return dispatch(removeCaseNoteFailure());
  }
};

export default removeCaseNote;
