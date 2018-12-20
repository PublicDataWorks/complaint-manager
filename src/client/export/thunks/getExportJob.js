import axios from "axios";
import {
  exportJobCompleted,
  addBackgroundJobFailure,
  clearCurrentExportJob
} from "../../actionCreators/exportActionCreators";
import {
  EXPORT_JOB_REFRESH_INTERVAL_MS,
  EXPORT_JOB_MAX_REFRESH_TIMES
} from "../../../sharedUtilities/constants";

const getExportJob = (jobId, currentRefreshCount = 1) => async dispatch => {
  try {
    const response = await axios.get(`api/export/job/${jobId}`);
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
