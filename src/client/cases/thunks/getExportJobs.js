import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import axios from "axios";
import { getExportJobsSuccess } from "../../actionCreators/exportActionCreators";

const getExportJobs = () => async dispatch => {
  try {
    const token = getAccessToken();
    if (!token) {
      dispatch(push("/login"));
      throw new Error("No access token found");
    }

    const exportJobs = await axios.get("/api/export/jobs", {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    });

    return dispatch(getExportJobsSuccess(exportJobs));
  } catch (e) {}
};

export default getExportJobs;
