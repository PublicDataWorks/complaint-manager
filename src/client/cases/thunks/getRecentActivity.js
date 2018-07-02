import config from "../../config/config";
import { getRecentActivitySuccess } from "../../actionCreators/casesActionCreators";
import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const getRecentActivity = caseId => async dispatch => {
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await axios(
      `${hostname}/api/cases/${caseId}/recent-activity`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    return dispatch(getRecentActivitySuccess(response.data));
  } catch (error) {}
};

export default getRecentActivity;
