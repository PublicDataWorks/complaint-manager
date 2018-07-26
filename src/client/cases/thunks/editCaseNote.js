import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import {
  closeCaseNoteDialog,
  editCaseNoteFailure,
  editCaseNoteSuccess
} from "../../actionCreators/casesActionCreators";
import config from "../../config/config";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const editCaseNote = values => async dispatch => {
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await axios(
      `${hostname}/api/cases/${values.caseId}/case-notes/${values.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(values)
      }
    );

    dispatch(editCaseNoteSuccess(response.data));
    return dispatch(closeCaseNoteDialog());
  } catch (error) {
    return dispatch(editCaseNoteFailure());
  }
};

export default editCaseNote;
