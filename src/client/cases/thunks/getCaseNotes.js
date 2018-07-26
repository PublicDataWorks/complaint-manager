import config from "../../config/config";
import { getCaseNotesSuccess } from "../../actionCreators/casesActionCreators";
import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const getCaseNotes = caseId => async dispatch => {
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await axios(
      `${hostname}/api/cases/${caseId}/case-notes`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    return dispatch(getCaseNotesSuccess(response.data));
  } catch (error) {}
};

export default getCaseNotes;
