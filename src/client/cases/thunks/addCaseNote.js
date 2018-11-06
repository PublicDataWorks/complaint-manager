import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import {
  addCaseNoteFailure,
  addCaseNoteSuccess,
  closeCaseNoteDialog
} from "../../actionCreators/casesActionCreators";
import config from "../../config/config";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const addCaseNote = (values, resolve) => async dispatch => {
  try {
    const token = getAccessToken();

    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await axios(
      `${hostname}/api/cases/${values.caseId}/case-notes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        data: JSON.stringify(values)
      }
    );

    dispatch(
      addCaseNoteSuccess(response.data.caseDetails, response.data.caseNotes)
    );
    dispatch(closeCaseNoteDialog());
    return resolve();
  } catch (error) {
    dispatch(addCaseNoteFailure());
    return resolve();
  }
};

export default addCaseNote;
