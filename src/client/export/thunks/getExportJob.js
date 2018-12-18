import getAccessToken from "../../auth/getAccessToken";
import { push } from "connected-react-router";
import axios from "axios";
import {
  exportJobCompleted,
  addBackgroundJobFailure,
  clearCurrentExportJob
} from "../../actionCreators/exportActionCreators";
import config from "../../config/config";
import {
  EXPORT_JOB_REFRESH_INTERVAL_MS,
  EXPORT_JOB_MAX_REFRESH_TIMES
} from "../../../sharedUtilities/constants";

const hostname = config[process.env.NODE_ENV].hostname;

const getExportJob = (jobId, currentRefreshCount = 1) => async dispatch => {
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await axios.get(`${hostname}/api/export/job/${jobId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`
      }
    });

    const job = response.data;
    if (job && job.state === "complete") {
      return dispatch(exportJobCompleted(job.downLoadUrl));
    }
    if (
      (job && job.state === "failed") ||
      currentRefreshCount > EXPORT_JOB_MAX_REFRESH_TIMES
    ) {
      dispatch(clearCurrentExportJob());
      return dispatch(addBackgroundJobFailure());
    }
    setTimeout(() => {
      return dispatch(getExportJob(jobId, currentRefreshCount + 1));
    }, EXPORT_JOB_REFRESH_INTERVAL_MS);
  } catch (e) {
    dispatch(clearCurrentExportJob());
    dispatch(addBackgroundJobFailure());
  }
};

export default getExportJob;
