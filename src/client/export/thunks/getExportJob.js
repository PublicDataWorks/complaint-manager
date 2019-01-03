import axios from "axios";
import {
  addBackgroundJobFailure,
  clearCurrentExportJob,
  exportJobCompleted
} from "../../actionCreators/exportActionCreators";
import config from "../../config/config";
import {
  EXPORT_JOB_MAX_REFRESH_TIMES,
  EXPORT_JOB_REFRESH_INTERVAL_MS
} from "../../../sharedUtilities/constants";

const hostname = config[process.env.NODE_ENV].hostname;

const getExportJob = (jobId, currentRefreshCount = 1) => async dispatch => {
  try {
    const response = await axios.get(`${hostname}/api/export/job/${jobId}`);
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
