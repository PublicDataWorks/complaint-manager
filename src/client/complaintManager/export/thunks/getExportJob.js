import axios from "axios";
import {
  clearCurrentExportJob,
  exportJobCompleted
} from "../../actionCreators/exportActionCreators";
import {
  EXPORT_JOB_MAX_REFRESH_TIMES,
  EXPORT_JOB_REFRESH_INTERVAL_MS
} from "../../../../sharedUtilities/constants";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

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
      return dispatch(
        snackbarError(
          "Something went wrong and your export failed. Please try again."
        )
      );
    }
    setTimeout(() => {
      return dispatch(getExportJob(jobId, currentRefreshCount + 1));
    }, EXPORT_JOB_REFRESH_INTERVAL_MS);
  } catch (e) {
    dispatch(clearCurrentExportJob());
  }
};

export default getExportJob;
