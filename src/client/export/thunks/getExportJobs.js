import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import axios from "axios";
import { getExportJobsSuccess } from "../../actionCreators/exportActionCreators";
import config from "../../config/config";

const hostname = config[process.env.NODE_ENV].hostname;

const getExportJobs = () => async dispatch => {
  try {
    const token = getAccessToken();
    if (!token) {
      dispatch(push("/login"));
      throw new Error("No access token found");
    }

    const response = await axios.get(`${hostname}/api/export/jobs`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`
      }
    });

    return dispatch(getExportJobsSuccess(response.data));
  } catch (e) {}
};

export default getExportJobs;
