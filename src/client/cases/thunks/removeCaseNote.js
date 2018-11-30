import getAccessToken from "../../auth/getAccessToken";
import {
  closeRemoveCaseNoteDialog,
  removeCaseNoteFailure,
  removeCaseNoteSuccess,
  toggleRemoveCaseNoteButtonDisabled
} from "../../actionCreators/casesActionCreators";
import config from "../../config/config";
import { push } from "react-router-redux";
import axios from "axios";
import { duration } from "@material-ui/core/styles/transitions";

const hostname = config[process.env.NODE_ENV].hostname;

const removeCaseNote = (caseId, caseNoteId) => async dispatch => {
  dispatch(toggleRemoveCaseNoteButtonDisabled());
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await axios(
      `${hostname}/api/cases/${caseId}/case-notes/${caseNoteId}`,
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
  } finally {
    setTimeout(
      dispatch,
      duration.leavingScreen,
      toggleRemoveCaseNoteButtonDisabled()
    );
  }
};

export default removeCaseNote;
